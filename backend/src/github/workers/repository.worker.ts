import workerpool from 'workerpool';
import YAML from 'yaml';

interface TreeEntryInput {
  path?: string | null;
  type?: string | null;
  size?: number | null;
}

interface AnalyzeTreePayload {
  tree: TreeEntryInput[];
}

interface NormalizeYamlPayload {
  encodedContent: string;
}

const YAML_FILE_PATTERN = /\.(ya?ml)$/i;

const analyzeTree = (payload: AnalyzeTreePayload) => {
  let totalBytes = 0;
  let fileCount = 0;
  let yamlPath: string | null = null;

  for (const entry of payload.tree) {
    if (entry?.type !== 'blob') {
      continue;
    }

    fileCount += 1;

    if (
      typeof entry.size === 'number' &&
      Number.isFinite(entry.size) &&
      entry.size > 0
    ) {
      totalBytes += entry.size;
    }

    if (
      !yamlPath &&
      typeof entry.path === 'string' &&
      YAML_FILE_PATTERN.test(entry.path)
    ) {
      yamlPath = entry.path;
    }
  }

  return {
    totalBytes,
    fileCount,
    yamlPath,
  };
};

const normalizeYaml = (payload: NormalizeYamlPayload) => {
  if (
    typeof payload.encodedContent !== 'string' ||
    payload.encodedContent.length === 0
  ) {
    return null;
  }

  let decoded: string;

  try {
    decoded = Buffer.from(payload.encodedContent, 'base64').toString('utf-8');
  } catch {
    return null;
  }

  const trimmed = decoded.trim();

  if (trimmed.length === 0) {
    return trimmed;
  }

  try {
    const parsed = YAML.parse(decoded);
    if (parsed !== undefined) {
      return YAML.stringify(parsed).trim();
    }
  } catch {
    /* fall back to the raw YAML content */
  }

  return trimmed;
};

workerpool.worker({
  analyzeTree,
  normalizeYaml,
});

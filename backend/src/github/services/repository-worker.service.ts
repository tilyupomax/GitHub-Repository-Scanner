import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { existsSync } from 'node:fs';
import { cpus } from 'node:os';
import { type WorkerOptions } from 'node:worker_threads';
import { join } from 'path';
import workerpool, { type Pool, type WorkerPoolOptions } from 'workerpool';

export interface TreeEntryPayload {
  path?: string | null;
  type?: string | null;
  size?: number | null;
}

export interface TreeAnalysisResult {
  totalBytes: number;
  fileCount: number;
  yamlPath: string | null;
}

type WorkerAction = 'analyzeTree' | 'normalizeYaml';
@Injectable()
export class RepositoryWorkerService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor() {
    const workerDirectory = join(__dirname, '..', 'workers');
    const jsWorkerScript = join(workerDirectory, 'repository.worker.js');
    const tsWorkerScript = join(workerDirectory, 'repository.worker.ts');

    let selectedScript = jsWorkerScript;
    let workerThreadOpts: WorkerOptions | undefined;

    if (!existsSync(jsWorkerScript) && existsSync(tsWorkerScript)) {
      selectedScript = tsWorkerScript;
      workerThreadOpts = {
        execArgv: ['-r', 'ts-node/register/transpile-only'],
      };
    }

    const cpuCount = Math.max(cpus()?.length ?? 1, 1);

    const poolOptions: WorkerPoolOptions = {
      workerType: 'thread',
      // Keep the pool saturated with threads up to the number of logical CPUs.
      minWorkers: cpuCount,
      maxWorkers: cpuCount,
    };

    if (workerThreadOpts) {
      poolOptions.workerThreadOpts = workerThreadOpts;
    }

    this.pool = workerpool.pool(selectedScript, poolOptions);
  }

  analyzeTree(tree: TreeEntryPayload[]): Promise<TreeAnalysisResult> {
    return this.pool.exec('analyzeTree', [
      { tree },
    ]) as Promise<TreeAnalysisResult>;
  }

  normalizeYaml(encodedContent: string): Promise<string | null> {
    return this.pool.exec('normalizeYaml', [{ encodedContent }]) as Promise<
      string | null
    >;
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.terminate();
  }
}

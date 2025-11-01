import type { Metadata } from "next";

import { ListItem } from "@mui/material";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { notFound } from "next/navigation";

import { getRepositoryDetails } from "@/api/repositories";
import { Header } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { routes } from "@/config/routes";

// Mark this page as dynamic
export const dynamic = "force-dynamic";

interface RepositoryDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RepositoryDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `${id} - GitHub Repository Scanner`,
    description: `Details for ${id} repository`,
  };
}

/**
 * Repository details page showing metadata, webhooks, and YAML sample
 */
export default async function RepositoryDetailsPage({ params }: RepositoryDetailsPageProps) {
  const { id } = await params;

  const repository = await getRepositoryDetails(id);

  if (!repository) {
    notFound();
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button href={routes.home.value} sx={{ mb: 3 }}>
          ← Back to List
        </Button>

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography variant="h4" component="h1">
                {repository.name}
              </Typography>
              <Chip
                label={repository.isPrivate ? "Private" : "Public"}
                color={repository.isPrivate ? "error" : "success"}
                size="small"
              />
            </Box>

            <Typography variant="body1" color="text.secondary" gutterBottom>
              Owner: {repository.owner}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" gutterBottom>
              <strong>Size:</strong> {repository.size.toLocaleString()} KB
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>File Count:</strong> {repository.fileCount.toLocaleString()}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" component="h2" gutterBottom>
              Active Webhooks
            </Typography>

            {repository.activeWebhooks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No active webhooks
              </Typography>
            ) : (
              <List>
                {repository.activeWebhooks.map((webhook) => (
                  <ListItem key={webhook.id}>
                    <ListItemText
                      primary={webhook.name}
                      secondary={
                        <Link href={webhook.url} target="_blank" rel="noopener noreferrer">
                          {webhook.url}
                        </Link>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {repository.yamlSample && (
              <>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" component="h2" gutterBottom>
                  YAML Sample
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {repository.yamlSample.path}
                </Typography>

                <Box
                  component="pre"
                  sx={{
                    backgroundColor: "grey.100",
                    p: 2,
                    borderRadius: 1,
                    overflow: "auto",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "0.875rem",
                  }}
                >
                  <code>{repository.yamlSample.content}</code>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

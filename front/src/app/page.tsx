import type { Metadata } from "next";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { getRepositories } from "@/api/repositories";
import { Header } from "@/components/layout";

import { RepositoryTableClient } from "./_components/RepositoryTableClient";

// Mark this page as dynamic
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GitHub Repository Scanner",
  description: "Browse and analyze GitHub repositories",
};

/**
 * Home page displaying list of repositories with filtering
 */
export default async function HomePage() {
  const repositories = await getRepositories();

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Repositories
        </Typography>
        <RepositoryTableClient repositories={repositories} />
      </Container>
    </>
  );
}

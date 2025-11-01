import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import { Header } from "@/components/layout";
import { Card } from "@/components/ui";

/**
 * Streaming fallback while repository details resolve
 */
export default function RepositoryDetailsPageLoading() {
  const metadataPlaceholders = Array.from({ length: 3 }, (_, index) => index);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Skeleton width={140} height={32} sx={{ mb: 3 }} />
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Skeleton width="35%" height={40} />
                <Skeleton variant="rounded" width={80} height={28} />
              </Box>

              <Skeleton width="25%" height={24} />

              <Divider sx={{ my: 1 }} />

              {metadataPlaceholders.map((item) => (
                <Skeleton key={item} width="45%" height={20} />
              ))}

              <Divider sx={{ my: 1 }} />

              <Skeleton width="30%" height={26} />
              <Skeleton width="100%" height={100} variant="rectangular" />
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

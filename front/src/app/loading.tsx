import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { Header } from "@/components/layout";

/**
 * Streaming fallback for the repository list while data loads
 */
export default function HomePageLoading() {
  const placeholderRows = Array.from({ length: 6 }, (_, index) => index);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Repositories
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="repositories table loading">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Skeleton width={120} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton width={100} height={24} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width={90} height={24} sx={{ ml: "auto" }} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {placeholderRows.map((row) => (
                <TableRow key={row} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Skeleton width="70%" height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="60%" height={20} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width="50%" height={20} sx={{ ml: "auto" }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

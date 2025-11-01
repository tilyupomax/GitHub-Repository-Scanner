"use client";

import type { Repository } from "@/api/repositories";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";

interface RepositoryTableProps {
  repositories: Repository[];
}

/**
 * Client component for displaying repositories
 */
export function RepositoryTableClient({ repositories }: RepositoryTableProps) {
  const router = useRouter();

  const handleRowClick = (repoName: string) => {
    router.push(routes.repository.details(repoName));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="repositories table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell align="right">Size (KB)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {repositories.map((repo) => (
            <TableRow
              key={`${repo.owner}/${repo.name}`}
              hover
              onClick={() => handleRowClick(repo.name)}
              sx={{ cursor: "pointer", "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {repo.name}
              </TableCell>
              <TableCell>{repo.owner}</TableCell>
              <TableCell align="right">{repo.size.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import {
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { type ChangeEvent, useEffect, useState } from "react";

interface ITableRow {
  id: string;
  username: string;
  email: string;
  amount: number;
  status?: string;
}

const rows: ITableRow[] = [
  {
    id: "2341434",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "sdf2341434",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "2341434dfd",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "2sdf341434",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "sdf2341434;lsdkf",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "2341434deiwrfd",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "2341434ofdnv",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "sdf234143wet;'adf4",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "2341434dfdofofivnd",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "234143osdwe.sdf4",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "sfhbenerwdf2341434",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
  {
    id: "2341434dfdgsdgs",
    username: "David Jones",
    email: "david@test.com",
    amount: 100,
  },
];

export default function WithdrawRequestsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>(
      rows.map((row) => ({ ...row, status: "pending" }))
    );

  useEffect(() => {
    const visibleTableData = rows
      .filter((_data, index) => index >= page * rowsPerPage && index < (page + 1) * rowsPerPage)
      .map((data) => {
        const existingRow = tableData.find((row) => row.id === data.id);
        return {
          ...data,
          status: existingRow?.status || "pending",
        };
      });

    setTableData(visibleTableData);
  }, [rowsPerPage, page]);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (id: string, newStatus: "approved" | "rejected") => {
    setTableData((prevTableData) =>
      prevTableData.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
    );
  };

  return (
    <Paper variant="outlined">
      <Stack direction="row" margin={2}>
        <Stack direction="row" gap={1} mr="auto">
          <TextField label="Search" size="small" />
          <TextField label="Property" size="small" />
        </Stack>

      </Stack>

      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.username}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.amount}</TableCell>

                <TableCell>
                {data.status === "pending" ? (
                    <>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleStatusChange(data.id, "approved")}
                      >
                        Approve
                      </Button>

                      &nbsp;

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleStatusChange(data.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span>{(data.status ?? "pending").charAt(0).toUpperCase() + (data.status ?? "pending").slice(1)}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Paper>
  );
}



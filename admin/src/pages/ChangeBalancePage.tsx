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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { type ChangeEvent, useEffect, useState } from "react";

interface ITableRow {
  id: string;
  username: string;
  email: string;
  balance: number;
}

const rows: ITableRow[] = [
  {
    id: "2341434",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "sdf2341434",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "2341434dfd",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "2sdf341434",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "sdf2341434;lsdkf",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "2341434deiwrfd",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "2341434ofdnv",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "sdf234143wet;'adf4",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "2341434dfdofofivnd",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "234143osdwe.sdf4",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "sfhbenerwdf2341434",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
  {
    id: "2341434dfdgsdgs",
    username: "David Jones",
    email: "david@test.com",
    balance: 100,
  },
];

export default function ChangeBalancePage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);

  useEffect(() => {
    const visibleTableData = rows.filter((data, index) => {
      console.log(page);
      if (index >= page * rowsPerPage && index < (page + 1) * rowsPerPage) {
        return data;
      }
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

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper variant="outlined">
      <Stack direction="row" margin={2} gap={1}>
        <TextField label="Search" size="small" />
        <TextField label="Property" size="small" />
      </Stack>

      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.username}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.balance}.00$</TableCell>

                <TableCell>
                  <Button onClick={handleClickOpen}>Change</Button>

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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Balance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the balance of the user
          </DialogContentText>
          <TextField
            label="Balance"
            type="number"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>

  );
}

import {
  Button,
  Divider,
  Paper,
  Stack,
  Switch,
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
  password: string;
}

const rows: ITableRow[] = [
  {
    id: "2341434",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "sdf2341434",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "2341434dfd",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "2sdf341434",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "sdf2341434;lsdkf",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "2341434deiwrfd",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "2341434ofdnv",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "sdf234143wet;'adf4",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "2341434dfdofofivnd",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "234143osdwe.sdf4",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "sfhbenerwdf2341434",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
  {
    id: "2341434dfdgsdgs",
    username: "David Jones",
    email: "david@test.com",
    password: "qwerty",
  },
];

export default function AdminManagerPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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

  return (
    <Paper variant="outlined">
      <Stack direction="row" margin={2}>
        <Stack direction="row" gap={1} mr="auto">
          <TextField label="Search" size="small" />
          <TextField label="Property" size="small" />
        </Stack>

        <Button variant="outlined" onClick={handleClickOpen}>Add New Admin</Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a new admin, please fill out the form below.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Username"
              type="text"
              fullWidth
            />
            <TextField
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Add</Button>
          </DialogActions>
        </Dialog>

      </Stack>

      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.username}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.password}</TableCell>

                <TableCell>
                  <Switch />
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

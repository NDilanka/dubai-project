import {
  Divider,
  Paper,
  Stack,
  Button,
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
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { type ChangeEvent, useEffect, useState } from "react";

interface ITableRow {
  id: string;
  username: string;
  email: string;
  date?: string;
}

const rows: ITableRow[] = [
  {
    id: "2341434",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "sdf2341434",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "2341434dfd",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "2sdf341434",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "sdf2341434;lsdkf",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "2341434deiwrfd",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "2341434ofdnv",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "sdf234143wet;'adf4",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "2341434dfdofofivnd",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "234143osdwe.sdf4",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "sfhbenerwdf2341434",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
  {
    id: "2341434dfdgsdgs",
    username: "David Jones",
    email: "david@test.com",
    date: "12/27/2024",
  },
];

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [currency, setCurrency] = useState("")

  useEffect(() => {
    const visibleTableData = rows.filter((data, index) => {
      console.log(page);
      if (index >= page * rowsPerPage && index < (page + 1) * rowsPerPage) {
        return data;
      }
    });

    setTableData(visibleTableData);
  }, [rowsPerPage, page]);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
              label="Current Password"
              type="text"
              fullWidth
              value="currentpassword"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              margin="dense"
              id="email"
              label="New Password"
              type="text"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="currency-select-label">Currency</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency-select"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              >
                <MenuItem value="admin">USD</MenuItem>
                <MenuItem value="moderator">CAD</MenuItem>
                <MenuItem value="user">INR</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Submit</Button>
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
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.username}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.date}</TableCell>

                <TableCell>
                  <Button onClick={handleClickOpen}>Edit</Button>
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


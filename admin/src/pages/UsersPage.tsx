import { Divider, Paper, Stack, Button, Table, TableBody, TableCell, TableContainer,
         TableHead, TablePagination, TableRow, TextField, Dialog, DialogTitle,
         DialogContent, DialogContentText, DialogActions, FormControl, InputLabel,
         MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

interface ITableRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  date?: string;
}

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [currency, setCurrency] = useState("")
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [editUser, setEditUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    date: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const visibleTableData = rows.filter((data, index) => {
      if (index >= page * rowsPerPage && index < (page + 1) * rowsPerPage) {
        return data;
      }
    });

    setTableData(visibleTableData);
  }, [rowsPerPage, page, rows]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users?role=User");

      if (response.ok) {
        const data = await response.json();

        const users = data.map((user: {
          _id: string;
          firstName: string;
          lastName: string;
          email: string;
          phoneNumber: string;
        }) => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber
        }));

        setRows(users);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleClickOpen = (tableRow: ITableRow) => {
    setEditUser({
      id: tableRow.id,
      firstName: tableRow.firstName,
      lastName: tableRow.lastName,
      email: tableRow.email,
      date: tableRow.date || ""
    });
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
          <DialogContent>
            <Stack gap={2}>
              <TextField
                autoFocus
                label="ID"
                type="text"
                fullWidth
                value={editUser.id}
              />

              <TextField
                autoFocus
                label="First Name"
                type="text"
                fullWidth
                value={editUser.firstName}
                onChange={(e) => setEditUser({...editUser, firstName: e.target.value})}
              />

              <TextField
                autoFocus
                label="Last Name"
                type="text"
                fullWidth
                value={editUser.lastName}
                onChange={(e) => setEditUser({...editUser, lastName: e.target.value})}
              />

              <TextField
                autoFocus
                label="Email"
                type="email"
                fullWidth
                value={editUser.email}
                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
              />

              <FormControl fullWidth>
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
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={handleClose}>Save Changes</Button>
            <Button variant="outlined" onClick={handleClose}>Reset</Button>
          </DialogActions>
        </Dialog>

      </Stack>

      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.firstName}</TableCell>
                <TableCell>{data.lastName}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.date}</TableCell>

                <TableCell>
                  <Button variant="contained" onClick={() => handleClickOpen(data)}>Edit</Button>
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


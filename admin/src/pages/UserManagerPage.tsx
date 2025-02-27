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
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

interface ITableRow {
  currency: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  date?: string;
}

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ITableRow[]>([]);
  const [editUser, setEditUser] = useState<ITableRow>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    date: "",
    currency: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const visibleTableData = rows.filter((data, index) => {
      return index >= page * rowsPerPage && index < (page + 1) * rowsPerPage;
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
          date: string;
          currency: string;
        }) => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          date: user.date,
          currency: user.currency,
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
      phoneNumber: tableRow.phoneNumber,
      date: tableRow.date || "",
      currency: tableRow.currency,
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

  const getDateString = (date: string) => {
    const dateObj = new Date(date);

    return `${dateObj.getDay()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`;
  };
  
  const handleSaveChanges = async () => {
    console.log("Save Changes clicked", editUser);
    try {
      const response = await fetch(`/api/users/save-changes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      });

      if (response.ok) {
        const result = await response.json();
        
        const updatedUser = result.updatedUser ? result.updatedUser : editUser;

        setRows((prevRows) =>
          prevRows.map((user) =>
            user.id === updatedUser.id ? { ...user, ...updatedUser } : user
          )
        );
        setOpen(false);
      } else {
        console.error("Failed to update user", await response.text());
      }
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  return (
    <Paper variant="outlined">
      <Stack direction="row" margin={2}>
        <Stack direction="row" gap={1} mr="auto">
          <TextField label="Search" size="small" />
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
                disabled
              />

              <TextField
                label="First Name"
                type="text"
                fullWidth
                value={editUser.firstName}
                onChange={(e) =>
                  setEditUser({ ...editUser, firstName: e.target.value })
                }
              />

              <TextField
                label="Last Name"
                type="text"
                fullWidth
                value={editUser.lastName}
                onChange={(e) =>
                  setEditUser({ ...editUser, lastName: e.target.value })
                }
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />

              <TextField
                label="Phone Number"
                type="text"
                fullWidth
                value={editUser.phoneNumber}
                onChange={(e) =>
                  setEditUser({ ...editUser, phoneNumber: e.target.value })
                }
              />

              <FormControl fullWidth>
                <InputLabel id="currency-select-label">Currency</InputLabel>
                <Select
                  labelId="currency-select-label"
                  id="currency-select"
                  value={editUser.currency}
                  label="Currency"
                  onChange={(e) =>
                    setEditUser({ ...editUser, currency: e.target.value })
                  }
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="CAD">CAD</MenuItem>
                  <MenuItem value="INR">INR</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Reset
            </Button>
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
              <TableCell>Phone Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Currency</TableCell>
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
                <TableCell>{data.phoneNumber}</TableCell>
                <TableCell>{getDateString(data.date || "")}</TableCell>
                <TableCell>{data.currency}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleClickOpen(data)}>
                    Edit
                  </Button>
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

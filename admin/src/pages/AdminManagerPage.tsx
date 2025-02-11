import { Box, Button, Divider, Paper, Stack, Switch, Table, TableBody, TableCell,
         TableContainer, TableHead, TablePagination, TableRow, TextField, Dialog,
         DialogTitle, DialogContent, DialogActions, DialogContentText, Menu, MenuItem,
         IconButton, } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

interface ITableRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  date?: string;
}

export default function AdminManagerPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
      const response = await fetch("/api/users?role=Admin");

      if (response.ok) {
        const data = await response.json();

        const admins = data.map((admin: {
          _id: string;
          firstName: string;
          lastName: string;
          email: string;
          phoneNumber: string;
          date: string;
        }) => ({
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phoneNumber: admin.phoneNumber,
          date: admin.date
        }));

        setRows(admins);
      }
    } catch (error: any) {
      console.error(error);
    }
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

  return (
    <Paper variant="outlined">
      <Stack direction="row" margin={2} justifyContent="space-between">
        <TextField label="Search" size="small" />
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
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
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
                <TableCell>
                  <Switch />
                </TableCell>

                <TableCell>
                  <Actions />
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

function Actions() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Disable</MenuItem>
      </Menu>
    </Box>
  );
}

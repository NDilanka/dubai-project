import { Box, Button, Divider, Paper, Stack, Table, TableBody, TableCell,
         TableContainer, TableHead, TablePagination, TableRow, TextField, Dialog,
         DialogTitle, DialogContent, DialogActions, DialogContentText, Menu, MenuItem,
         IconButton, Slide, Alert } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useRef, useState } from "react";
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
  const [openModel, setOpenModel] = useState(false);
  const [openEditAdminFormModel, setOpenEditAdminFormModel] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const [showPopUp, setShowPopUp] = useState(false);

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

  const handleClickOpen = () => {
    setOpenModel(true);
  };

  const handleClose = () => {
    setOpenModel(false);
  };

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

  const handleClickEdit = () => {
    setOpenEditAdminFormModel(true);
  };

  const handleClickDisable = () => {

  };

  const handleCloseEditAdminModel = () => {
    setOpenEditAdminFormModel(false);
  };

  return (
    <>
      <Box sx={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)" }}>
        <Slide in={showPopUp} container={containerRef.current}>
          <Alert severity="success">New admin created succussfully!</Alert>
        </Slide>
      </Box>

      <Paper variant="outlined">
        <Stack direction="row" margin={2} justifyContent="space-between">
          <TextField label="Search" size="small" />
          <Button variant="outlined" onClick={handleClickOpen}>Add New Admin</Button>

          <NewAdminForm open={openModel} onClose={handleClose} />
          <EditAdminForm open={openEditAdminFormModel} onClose={handleCloseEditAdminModel} />
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
                  <TableCell>Active</TableCell>

                  <TableCell>
                    <Actions onClickEdit={handleClickEdit} onClickDisable={handleClickDisable} />
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
    </>
  );
}

function Actions({ 
  onClickEdit, 
  onClickDisable 
}: { 
  onClickEdit: () => void; 
  onClickDisable: () => void;
}) 
{
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openModel = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    onClickEdit();
    handleClose();
  };

  const handleClickDisable = () => {
    onClickDisable();
    handleClose();
  };

  return (
    <Box>
      <IconButton
        id="basic-button"
        aria-controls={openModel ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openModel ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openModel}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClickEdit}>Edit</MenuItem>
        <MenuItem onClick={handleClickDisable}>Disable</MenuItem>
      </Menu>
    </Box>
  );
}

function NewAdminForm({ open, onClose }: 
                      { open: boolean, onClose?: () => void; }) {
  const [adminFormData, setAdminFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });

  const handleClickAdd = async () => {
    try {
      const response = await fetch("/api/users?role=Admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(adminFormData)
      });

      if (response.ok) {
        // TODO: Show an alert or something.
        if (onClose) {
          onClose();
        }
      } else {
        // TODO: Show an alert or something.
      }
    } catch (error: any) {
      console.error(error);

      // TODO: Show an alert or something.
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Admin</DialogTitle>

      <DialogContent>
        <DialogContentText>
          To add a new admin, please fill out the form below.
        </DialogContentText>

        <TextField
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          value={adminFormData.firstName}
          onChange={e => setAdminFormData({ ...adminFormData, firstName: e.target.value })}
        />

        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          value={adminFormData.lastName}
          onChange={e => setAdminFormData({ ...adminFormData, lastName: e.target.value })}
        />

        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={adminFormData.email}
          onChange={e => setAdminFormData({ ...adminFormData, email: e.target.value })}
        />

        <TextField
          margin="dense"
          label="Phone Number"
          type="tel"
          fullWidth
          value={adminFormData.phoneNumber}
          onChange={e => setAdminFormData({ ...adminFormData, phoneNumber: e.target.value })}
        />

        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={adminFormData.password}
          onChange={e => setAdminFormData({ ...adminFormData, password: e.target.value })}
        />

      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleClickAdd}>Add</Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function EditAdminForm({ open, onClose }: 
                      { open: boolean, onClose?: () => void; }) {
  const [adminFormData, setAdminFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });

  const handleClickAdd = async () => {
    try {
      const response = await fetch("/api/users?role=Admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(adminFormData)
      });

      if (response.ok) {
        // TODO: Show an alert or something.
        if (onClose) {
          onClose();
        }
      } else {
        // TODO: Show an alert or something.
      }
    } catch (error: any) {
      console.error(error);

      // TODO: Show an alert or something.
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Admin</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Edit admin details and click save changes.
        </DialogContentText>

        <TextField
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          value={adminFormData.firstName}
          onChange={e => setAdminFormData({ ...adminFormData, firstName: e.target.value })}
        />

        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          value={adminFormData.lastName}
          onChange={e => setAdminFormData({ ...adminFormData, lastName: e.target.value })}
        />

        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={adminFormData.email}
          onChange={e => setAdminFormData({ ...adminFormData, email: e.target.value })}
        />

        <TextField
          margin="dense"
          label="Phone Number"
          type="tel"
          fullWidth
          value={adminFormData.phoneNumber}
          onChange={e => setAdminFormData({ ...adminFormData, phoneNumber: e.target.value })}
        />

        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={adminFormData.password}
          onChange={e => setAdminFormData({ ...adminFormData, password: e.target.value })}
        />

      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleClickAdd}>Save Changes</Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

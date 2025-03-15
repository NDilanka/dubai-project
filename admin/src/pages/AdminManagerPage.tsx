import {
  Box,
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
  Menu,
  MenuItem,
  IconButton,
  Slide,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

interface ITableRow {
  id: string;
  autoFXId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleName: string;
  date?: string;
  active: boolean;
}

export default function AdminManagerPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [rows, setRows] = useState<ITableRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<ITableRow[]>([]);
  const [openModel, setOpenModel] = useState(false);
  const [openEditAdminFormModel, setOpenEditAdminFormModel] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const visibleTableData = filteredRows.filter((data, index) => {
      if (index >= page * rowsPerPage && index < (page + 1) * rowsPerPage) {
        return data;
      }
    });

    setTableData(visibleTableData);
  }, [rowsPerPage, page, filteredRows]);

  useEffect(() => {
    const filteredRows = applyFilter();
    setFilteredRows(filteredRows);
  }, [rows, searchText]);

  const applyFilter = (): ITableRow[] => {
    const searchId = rows.filter((row) => {
      return row.autoFXId.toString().includes(searchText);
    });

    if (searchId.length > 0) {
      return searchId;
    }

    const searchFirstName = rows.filter((row) => {
      return row.firstName.includes(searchText);
    });

    if (searchFirstName.length > 0) {
      return searchFirstName;
    }

    const searchLastName = rows.filter((row) => {
      return row.lastName.includes(searchText);
    });

    if (searchLastName.length > 0) {
      return searchLastName;
    }

    const searchEmail = rows.filter((row) => {
      return row.email.includes(searchText);
    });

    if (searchEmail.length > 0) {
      return searchEmail;
    }

    const searchPhoneNumber = rows.filter((row) => {
      return row.phoneNumber.includes(searchText);
    });

    if (searchPhoneNumber.length > 0) {
      return searchPhoneNumber;
    }

    return [];
  };

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

        const admins = data.map(
          (admin: {
            _id: string;
            autoFXId: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            role: { _id: string; name: string; description: string };
            date: string;
            active: boolean;
          }) => ({
            id: admin._id,
            autoFXId: admin.autoFXId,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            phoneNumber: admin.phoneNumber,
            roleName: admin.role.name,
            date: admin.date,
            active: admin.active,
          }),
        );

        setRows(admins);
      } else {
        // TODO: Display an error message.
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

  const handleClickToggleStatus = async (id: string, newState: boolean) => {
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, newState }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        // TODO: Display an alert.
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleCloseEditAdminModel = () => {
    setOpenEditAdminFormModel(false);
  };

  const handleSelectedRowIndex = (index: number) => {
    setSelectedRowIndex(index + rowsPerPage * page);
  };

  const handleFinishAddAdmin = () => {
    fetchUsers();
  };

  const handleFinishEditAdmin = (message: string) => {
    setPopUpMessage(message);
    setShowPopUp(true);
    setTimeout(() => {
      setShowPopUp(false);
    }, 3000);
    fetchUsers();
  };

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: 0,
          transform: "translateX(-50%)",
        }}
      >
        <Slide in={showPopUp} container={containerRef.current}>
          <Alert severity="success">{popUpMessage}</Alert>
        </Slide>
      </Box>

      <Paper variant="outlined">
        <Stack direction="row" margin={2} justifyContent="space-between">
          <TextField
            label="Search"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant="outlined" onClick={handleClickOpen}>
            Add New Admin
          </Button>

          <NewAdminForm
            open={openModel}
            onClose={handleClose}
            onFinish={handleFinishAddAdmin}
          />
          <EditAdminForm
            open={openEditAdminFormModel}
            onClose={handleCloseEditAdminModel}
            selectedRow={tableData[selectedRowIndex]}
            onFinish={handleFinishEditAdmin}
          />
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
                <TableCell>State</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((data, index) => {
                if (data.roleName === "Super Admin") {
                  return (
                    <TableRow
                      key={data.id}
                      sx={{ bgcolor: data.active ? "#ffff00" : "#ff8888" }}
                    >
                      <TableCell>{data.autoFXId}</TableCell>
                      <TableCell>{data.firstName}</TableCell>
                      <TableCell>{data.lastName}</TableCell>
                      <TableCell>{data.email}</TableCell>
                      <TableCell>{data.phoneNumber}</TableCell>
                      <TableCell>{getDateString(data.date || "")}</TableCell>
                      <TableCell>
                        {data.active ? "Active" : "Inactive"}
                      </TableCell>

                      <TableCell>
                        <Actions
                          onClickEdit={handleClickEdit}
                          onClickToggleStatus={(newState: boolean) =>
                            handleClickToggleStatus(data.id, newState)
                          }
                          selectedRowIndex={index}
                          onSelectedRowIndex={handleSelectedRowIndex}
                          state={data.active}
                          disableActivationControl={true}
                        />
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow
                      key={data.id}
                      sx={{ bgcolor: data.active ? "" : "#ff8888" }}
                    >
                      <TableCell>{data.autoFXId}</TableCell>
                      <TableCell>{data.firstName}</TableCell>
                      <TableCell>{data.lastName}</TableCell>
                      <TableCell>{data.email}</TableCell>
                      <TableCell>{data.phoneNumber}</TableCell>
                      <TableCell>{getDateString(data.date || "")}</TableCell>
                      <TableCell>
                        {data.active ? "Active" : "Inactive"}
                      </TableCell>

                      <TableCell>
                        <Actions
                          onClickEdit={handleClickEdit}
                          onClickToggleStatus={(newState: boolean) =>
                            handleClickToggleStatus(data.id, newState)
                          }
                          selectedRowIndex={index}
                          onSelectedRowIndex={handleSelectedRowIndex}
                          state={data.active}
                          disableActivationControl={false}
                        />
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
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
  onClickToggleStatus,
  selectedRowIndex,
  onSelectedRowIndex,
  state,
  disableActivationControl,
}: {
  onClickEdit: () => void;
  onClickToggleStatus: (newState: boolean) => void;
  selectedRowIndex: number;
  onSelectedRowIndex: (index: number) => void;
  state: boolean; // true -> Active, false -> Inactive
  disableActivationControl: boolean;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openModel = Boolean(anchorEl);
  const [statusActive, setStatusActive] = useState(state);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    onSelectedRowIndex(selectedRowIndex);
    onClickEdit();
    handleClose();
  };

  const handleClickToggleStatus = () => {
    onClickToggleStatus(!state);
    setStatusActive(!state);
    handleClose();
  };

  return (
    <Box>
      <IconButton
        id="basic-button"
        aria-controls={openModel ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openModel ? "true" : undefined}
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
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClickEdit}>Edit</MenuItem>

        {!disableActivationControl && (
          <MenuItem onClick={handleClickToggleStatus}>
            {statusActive ? "Deactivate" : "Activate"}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}

function NewAdminForm({
  open,
  onClose,
  onFinish,
}: {
  open: boolean;
  onClose?: () => void;
  onFinish: () => void;
}) {
  const [adminFormData, setAdminFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleClickAdd = async () => {
    try {
      const response = await fetch("/api/users?role=Admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminFormData),
      });

      if (response.ok) {
        // TODO: Show an alert or something.
        if (onClose) {
          onFinish();
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
          onChange={(e) =>
            setAdminFormData({ ...adminFormData, firstName: e.target.value })
          }
        />

        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          value={adminFormData.lastName}
          onChange={(e) =>
            setAdminFormData({ ...adminFormData, lastName: e.target.value })
          }
        />

        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={adminFormData.email}
          onChange={(e) =>
            setAdminFormData({ ...adminFormData, email: e.target.value })
          }
        />

        <TextField
          margin="dense"
          label="Phone Number"
          type="tel"
          fullWidth
          value={adminFormData.phoneNumber}
          onChange={(e) =>
            setAdminFormData({ ...adminFormData, phoneNumber: e.target.value })
          }
        />

        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={adminFormData.password}
          onChange={(e) =>
            setAdminFormData({ ...adminFormData, password: e.target.value })
          }
        />
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleClickAdd}>
          Add
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EditAdminForm({
  open,
  onClose,
  selectedRow,
  onFinish,
}: {
  open: boolean;
  onClose?: () => void;
  selectedRow: ITableRow;
  onFinish: (message: string) => void;
}) {
  const [adminFormData, setAdminFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (selectedRow) {
      setAdminFormData({
        firstName: selectedRow.firstName,
        lastName: selectedRow.lastName,
        email: selectedRow.email,
        phoneNumber: selectedRow.phoneNumber,
      });
    }
  }, [selectedRow]);

  const handleClickSaveChanges = async () => {
    try {
      const response = await fetch("/api/users?role=Admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedRow.id,
          firstName: adminFormData.firstName,
          lastName: adminFormData.lastName,
          email: adminFormData.email,
          phoneNumber: adminFormData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (onClose) {
          onFinish(data.message);
          onClose();
        }
      } else {
        onFinish(data.message);
      }
    } catch (error: any) {
      console.error(error);

      onFinish("Something went wrong!");
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
          onChange={(e) =>
            setAdminFormData({ ...adminFormData, firstName: e.target.value })
          }
        />

        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          value={adminFormData.lastName}
          onChange={(e) =>
            setAdminFormData({ ...adminFormData, lastName: e.target.value })
          }
        />

        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={adminFormData.email}
          onChange={(e) =>
            setAdminFormData({ ...adminFormData, email: e.target.value })
          }
        />

        <TextField
          margin="dense"
          label="Phone Number"
          type="tel"
          fullWidth
          value={adminFormData.phoneNumber}
          onChange={(e) =>
            setAdminFormData({ ...adminFormData, phoneNumber: e.target.value })
          }
        />
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleClickSaveChanges}>
          Save Changes
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

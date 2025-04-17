import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
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
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

interface ITableRow {
  id: string;
  autoFXId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
  status: string;
  method?: string; // Optional field to differentiate between USDT and Bank Transfer
  uname?: string; // For Bank Transfer
  bankName?: string; // For Bank Transfer
  accountnumber?: string; // For Bank Transfer
  IFSC?: string; // For Bank Transfer
  branch?: string; // For Bank Transfer
  UPIAddress?: string; // For Bank Transfer
  remarks: string;
}

export default function WithdrawRequestsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [rows, setRows] = useState<ITableRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<ITableRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ITableRow | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isShowRemarksPopUp, setIsShowRemarksPopUp] = useState(false);
  const [selectedRowRemarks, setSelectedRowRemarks] = useState({
    id: "",
    remarks: "",
  });

  useEffect(() => {
    fetchWithdraws();
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

  useEffect(() => {
    console.log(selectedRequest);
  }, [selectedRequest]);

  const applyFilter = (): ITableRow[] => {
    const searchId = rows.filter((row) => {
      return row.id.includes(searchText);
    });

    if (searchId.length > 0) {
      return searchId;
    }

    const searchEmail = rows.filter((row) => {
      return row.email.includes(searchText);
    });

    if (searchEmail.length > 0) {
      return searchEmail;
    }

    return [];
  };

  const fetchWithdraws = async () => {
    try {
      const response = await fetch("/api/withdraws");

      if (response.ok) {
        const data = await response.json();

        const withdraws = data.map(
          (withdraw: {
            _id: string;
            amount: string;
            status: string;
            remarks: string;
            createdAt: string;
            updatedAt: string;
            user: {
              _id: string;
              autoFXId: string;
              email: string;
            };
            method?: string;
            username?: string;
            bankName?: string;
            accountnumber?: string;
            IFSC?: string;
            branch?: string;
            UPIAddress?: string;
          }) => ({
            id: withdraw._id,
            autoFXId: withdraw.user.autoFXId,
            email: withdraw.user.email,
            amount: withdraw.amount,
            status: withdraw.status,
            remarks: withdraw.remarks,
            createdAt: withdraw.createdAt,
            updatedAt: withdraw.updatedAt,
            method: withdraw.method,
            uname: withdraw.username,
            bankName: withdraw.bankName,
            accountnumber: withdraw.accountnumber,
            IFSC: withdraw.IFSC,
            branch: withdraw.branch,
            UPIAddress: withdraw.UPIAddress,
          }),
        );

        withdraws.reverse();

        setRows(withdraws);
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

  const handleClickAccept = async (rowId: string) => {
    const originalRows = [...rows];
    try {
      const updatedRows = rows.map((row) =>
        row.id === rowId ? { ...row, status: "Accepted" } : row,
      );
      setRows(updatedRows);

      const response = await fetch("/api/withdraws", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: rowId,
          status: "Accepted",
        }),
      });

      if (!response.ok) throw new Error("Accept failed");
      await fetchWithdraws(); // Sync with server
    } catch (error) {
      console.error(error);
      setRows(originalRows); // Revert on error
      // TODO: Show error notification
    }
  };

  const handleClickReject = async (rowId: string) => {
    const originalRows = [...rows];
    try {
      const updatedRows = rows.map((row) =>
        row.id === rowId ? { ...row, status: "Rejected" } : row,
      );
      setRows(updatedRows);

      const response = await fetch("/api/withdraws", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: rowId,
          status: "Rejected",
        }),
      });

      if (!response.ok) throw new Error("Reject failed");
      await fetchWithdraws(); // Sync with server
    } catch (error) {
      console.error(error);
      setRows(originalRows); // Revert on error
      // TODO: Show error notification
    }
  };

  const handleClickViewRequest = (row: ITableRow) => {
    setSelectedRequest(row);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedRequest(null);
  };

  const handleAddRemarks = (id: string) => {
    const selectedRow = tableData.filter((data) => data.id === id)[0];

    setSelectedRowRemarks({ id, remarks: selectedRow.remarks });

    setIsShowRemarksPopUp(true);
  };

  const handleCloseRemarksPopUp = () => {
    setIsShowRemarksPopUp(false);
  };

  const handleSubmitRemarks = async () => {
    try {
      const response = await fetch("/api/withdraw-remarks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedRowRemarks),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);

        fetchWithdraws();
      } else {
        // TODO: Display an error message.
      }
    } catch (error: any) {
      console.error(error);
    }

    setIsShowRemarksPopUp(false);
  };

  return (
    <Paper variant="outlined">
      <Box margin={2}>
        <TextField
          label="Search"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((data) => {
              const date = new Date(data.createdAt);
              return (
                <TableRow
                  key={data.id}
                  sx={{
                    backgroundColor:
                      data.status === "Accepted"
                        ? "rgba(144, 238, 144, 0.3)"
                        : data.status === "Rejected"
                          ? "rgba(255, 99, 71, 0.3)"
                          : "inherit",
                    "&:hover": {
                      backgroundColor:
                        data.status === "Accepted"
                          ? "rgba(144, 238, 144, 0.5)"
                          : data.status === "Rejected"
                            ? "rgba(255, 99, 71, 0.5)"
                            : "inherit",
                    },
                  }}
                >
                  <TableCell>{data.id}</TableCell>
                  <TableCell>{data.email}</TableCell>
                  <TableCell>
                    {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                  </TableCell>
                  <TableCell>$ {data.amount.toFixed(2)}</TableCell>
                  <TableCell>{data.status}</TableCell>

                  <TableCell>
                    <Actions
                      onClickAccept={handleClickAccept}
                      onClickReject={handleClickReject}
                      onClickViewRequest={() => handleClickViewRequest(data)}
                      onClickAddRemarks={() => handleAddRemarks(data.id)}
                      rowId={data.id}
                      state={false}
                    />
                  </TableCell>
                </TableRow>
              );
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

      <Dialog open={isViewModalOpen} onClose={handleCloseViewModal}>
        <DialogTitle sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
          Withdraw Request Details
        </DialogTitle>
        <DialogContent sx={{ padding: "20px", minWidth: "400px" }}>
          {selectedRequest && (
            <>
              <Box sx={{ marginBottom: "16px" }}>
                <DialogContentText sx={{ fontWeight: "bold", color: "#333" }}>
                  ID:
                </DialogContentText>
                <DialogContentText>{selectedRequest.id}</DialogContentText>
              </Box>

              <Box sx={{ marginBottom: "16px" }}>
                <DialogContentText sx={{ fontWeight: "bold", color: "#333" }}>
                  Email:
                </DialogContentText>
                <DialogContentText>{selectedRequest.email}</DialogContentText>
              </Box>

              <Box sx={{ marginBottom: "16px" }}>
                <DialogContentText sx={{ fontWeight: "bold", color: "#333" }}>
                  Date:
                </DialogContentText>

                <DialogContentText>
                  {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </DialogContentText>
              </Box>

              <Box sx={{ marginBottom: "16px" }}>
                <DialogContentText sx={{ fontWeight: "bold", color: "#333" }}>
                  Amount:
                </DialogContentText>

                <DialogContentText>
                  $ {selectedRequest.amount.toFixed(2)}
                </DialogContentText>
              </Box>

              <Box sx={{ marginBottom: "16px" }}>
                <DialogContentText sx={{ fontWeight: "bold", color: "#333" }}>
                  Status:
                </DialogContentText>

                <DialogContentText
                  sx={{
                    color:
                      selectedRequest.status === "Accepted"
                        ? "green"
                        : selectedRequest.status === "Rejected"
                          ? "red"
                          : "inherit",
                    fontWeight: "bold",
                  }}
                >
                  {selectedRequest.status}
                </DialogContentText>
              </Box>

              <Box sx={{ marginBottom: "16px" }}>
                <DialogContentText sx={{ fontWeight: "bold", color: "#333" }}>
                  Remarks:
                </DialogContentText>

                <DialogContentText>
                  {selectedRequest.remarks}
                </DialogContentText>
              </Box>

              {selectedRequest.method === "BankTransfer" && (
                <>
                  <Box sx={{ marginBottom: "16px" }}>
                    <DialogContentText
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      Username:
                    </DialogContentText>
                    <DialogContentText>
                      {selectedRequest.uname}
                    </DialogContentText>
                  </Box>

                  <Box sx={{ marginBottom: "16px" }}>
                    <DialogContentText
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      Bank Name:
                    </DialogContentText>
                    <DialogContentText>
                      {selectedRequest.bankName}
                    </DialogContentText>
                  </Box>

                  <Box sx={{ marginBottom: "16px" }}>
                    <DialogContentText
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      Account Number:
                    </DialogContentText>
                    <DialogContentText>
                      {selectedRequest.accountnumber}
                    </DialogContentText>
                  </Box>

                  <Box sx={{ marginBottom: "16px" }}>
                    <DialogContentText
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      IFSC:
                    </DialogContentText>
                    <DialogContentText>
                      {selectedRequest.IFSC}
                    </DialogContentText>
                  </Box>

                  <Box sx={{ marginBottom: "16px" }}>
                    <DialogContentText
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      Branch:
                    </DialogContentText>
                    <DialogContentText>
                      {selectedRequest.branch}
                    </DialogContentText>
                  </Box>

                  <Box sx={{ marginBottom: "16px" }}>
                    <DialogContentText
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      UPI Address:
                    </DialogContentText>
                    <DialogContentText>
                      {selectedRequest.UPIAddress}
                    </DialogContentText>
                  </Box>

                  <Box sx={{ marginBottom: "16px" }}>
                    <DialogContentText
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      Remarks:
                    </DialogContentText>
                    <DialogContentText>
                      {selectedRequest.remarks}
                    </DialogContentText>
                  </Box>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
          <Button
            onClick={handleCloseViewModal}
            sx={{ color: "#333", fontWeight: "bold" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isShowRemarksPopUp} onClose={handleCloseViewModal}>
        <DialogTitle sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
          Remarks
        </DialogTitle>

        <DialogContent sx={{ padding: "20px", minWidth: "400px" }}>
          <TextField
            margin="dense"
            multiline
            fullWidth
            value={selectedRowRemarks.remarks}
            onChange={(e) =>
              setSelectedRowRemarks({
                ...selectedRowRemarks,
                remarks: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions sx={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
          <Button
            onClick={handleSubmitRemarks}
            sx={{ fontWeight: "bold" }}
            color="primary"
          >
            Submit
          </Button>

          <Button
            onClick={handleCloseRemarksPopUp}
            sx={{ color: "#333", fontWeight: "bold" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

function Actions({
  onClickAccept,
  onClickReject,
  onClickViewRequest,
  onClickAddRemarks,
  rowId,
  state,
}: {
  onClickAccept: (rowId: string) => void;
  onClickReject: (rowId: string) => void;
  onClickViewRequest: () => void;
  onClickAddRemarks: () => void;
  rowId: string;
  state: boolean;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openModel = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickAccept = () => {
    onClickAccept(rowId);
    handleClose();
  };

  const handleClickReject = () => {
    onClickReject(rowId);
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
        <MenuItem onClick={handleClickAccept}>Accept</MenuItem>
        <MenuItem onClick={handleClickReject}>Reject</MenuItem>
        <MenuItem onClick={onClickViewRequest}>View Request</MenuItem>
        <MenuItem onClick={onClickAddRemarks}>Add or Update Remarks</MenuItem>
      </Menu>
    </Box>
  );
}

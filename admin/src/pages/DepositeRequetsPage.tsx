import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ITableRow {
  id: string;
  email: string;
  amount: number;
  status: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}

export default function DepositeRequestsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [rows, setRows] = useState<ITableRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<ITableRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetchDeposits();
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
    const searchEmail = rows.filter(row => {
      return row.email.includes(searchText);
    });

    if (searchEmail.length > 0) {
      return searchEmail;
    }

    return [];
  };

  const fetchDeposits = async () => {
    try {
      const response = await fetch("/api/deposits");

      if (response.ok) {
        const data = await response.json();

        const deposits = data.map((deposit: {
          _id: string;
          filePath: string;
          amount: number;
          createdAt: string;
          updatedAt: string;
          status: string;
          user: {
            _id: string;
            email: string;
          }
        }) => ({
          id: deposit._id,
          email: deposit.user.email,
          amount: deposit.amount,
          status: deposit.status,
          filePath: deposit.filePath,
          createdAt: deposit.createdAt,
          updatedAt: deposit.updatedAt
        }));

        setRows(deposits);
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
      const updatedRows = rows.map(row =>
        row.id === rowId ? { ...row, status: 'Accepted' } : row
      );
      setRows(updatedRows);

      const response = await fetch("/api/deposits", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: rowId,
          status: "Accepted"
        })
      });

      if (!response.ok) throw new Error('Accept failed');
      await fetchDeposits(); // Sync with server
    } catch (error) {
      console.error(error);
      setRows(originalRows); // Revert on error
      // TODO: Show error notification
    }
  };

  const handleClickReject = async (rowId: string) => {
    const originalRows = [...rows];
    try {
      const updatedRows = rows.map(row =>
        row.id === rowId ? { ...row, status: 'Rejected' } : row
      );
      setRows(updatedRows);

      const response = await fetch("/api/deposits", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: rowId,
          status: "Rejected"
        })
      });

      if (!response.ok) throw new Error('Reject failed');
      await fetchDeposits(); // Sync with server
    } catch (error) {
      console.error(error);
      setRows(originalRows); // Revert on error
      // TODO: Show error notification
    }
  };

  const handleClickViewImage = (filePath: string) => {
    const fullPath = `http://localhost:8000/${filePath.replace("./", "")}`;
    setSelectedImage(fullPath);
    setOpenDialog(true);
  };

  return (
    <>
      <Paper variant="outlined">
        <Stack direction="row" margin={2}>
          <TextField
            label="Search"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Stack>

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
              {tableData.map((data, index) => {
                const date = new Date(data.createdAt);
                return (
                  <TableRow
                    key={data.id}
                    sx={{
                      backgroundColor: data.status === 'Accepted'
                        ? 'rgba(144, 238, 144, 0.3)'
                        : data.status === 'Rejected'
                          ? 'rgba(255, 99, 71, 0.3)'
                          : 'inherit',
                      '&:hover': {
                        backgroundColor: data.status === 'Accepted'
                          ? 'rgba(144, 238, 144, 0.5)'
                          : data.status === 'Rejected'
                            ? 'rgba(255, 99, 71, 0.5)'
                            : 'inherit',
                      }
                    }}
                  >
                    <TableCell>{data.id}</TableCell>
                    <TableCell>{data.email}</TableCell>
                    <TableCell>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</TableCell>
                    <TableCell>$ {data.amount.toFixed(2)}</TableCell>
                    <TableCell>{data.status}</TableCell>
                    <TableCell>
                      <Actions
                        onClickAccept={handleClickAccept}
                        onClickReject={handleClickReject}
                        onClickViewImage={handleClickViewImage}
                        rowId={data.id}
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
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Deposit Proof</DialogTitle>
        <DialogContent>
          <img src={selectedImage} alt="Deposit Proof" style={{ width: "100%", height: "auto" }} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function Actions({
  onClickAccept,
  onClickReject,
  onClickViewImage,
  rowId
}: {
  onClickAccept: (rowId: string) => void;
  onClickReject: (rowId: string) => void;
  onClickViewImage: (filePath: string) => void;
  rowId: string;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openModel = Boolean(anchorEl);

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
        <MenuItem onClick={() => { onClickAccept(rowId); handleClose(); }}>Accept</MenuItem>
        <MenuItem onClick={() => { onClickReject(rowId); handleClose(); }}>Reject</MenuItem>
        <MenuItem onClick={() => { onClickViewImage(rowId); handleClose(); }}>View Receipt</MenuItem>
      </Menu>
    </Box>
  );
}

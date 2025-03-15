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
}

export default function WithdrawRequestsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [rows, setRows] = useState<ITableRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<ITableRow[]>([]);
  const [searchText, setSearchText] = useState("");

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
            createdAt: string;
            updatedAt: string;
            user: {
              _id: string;
              autoFXId: string;
              email: string;
            };
          }) => ({
            id: withdraw._id,
            autoFXId: withdraw.user.autoFXId,
            email: withdraw.user.email,
            amount: withdraw.amount,
            status: withdraw.status,
            createdAt: withdraw.createdAt,
            updatedAt: withdraw.updatedAt,
          }),
        );

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
    </Paper>
  );
}

function Actions({
  onClickAccept,
  onClickReject,
  rowId,
}: {
  onClickAccept: (rowId: string) => void;
  onClickReject: (rowId: string) => void;
  rowId: string;
  state: boolean; // true -> Active, false -> Inactive
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
      </Menu>
    </Box>
  );
}

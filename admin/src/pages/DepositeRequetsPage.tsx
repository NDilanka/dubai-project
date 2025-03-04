import { Box, Divider, IconButton, Menu, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead,
         TablePagination, TableRow, TextField } from "@mui/material";
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

  const handleClickAccept = async (rowIndex: number) => {
    try {
      const response = await fetch("/api/deposits", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: rows[rowIndex].id,
          status: "Accepted"
        })
      });

      if (response.ok) {
        fetchDeposits();
      } else {
        // TODO: Display an alert.
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleClickReject = async (rowIndex: number) => {
    try {
      const response = await fetch("/api/deposits", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: rows[rowIndex].id,
          status: "Rejected"
        })
      });

      if (response.ok) {
        fetchDeposits();
      } else {
        // TODO: Display an alert.
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
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
              return <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</TableCell>
                <TableCell>$ {data.amount.toFixed(2)}</TableCell>
                <TableCell>{data.status}</TableCell>
                <TableCell>
                  <Actions 
                    onClickAccept={handleClickAccept} 
                    onClickReject={handleClickReject}
                    rowIndex={index} 
                    state={false}
                  />
                </TableCell>
              </TableRow>
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
  rowIndex,
}: { 
  onClickAccept: (rowIndex: number) => void; 
  onClickReject: (rowIndex: number) => void; 
  rowIndex: number;
  state: boolean; // true -> Active, false -> Inactive
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

  const handleClickAccept = () => {
    onClickAccept(rowIndex);
    handleClose();
  };

  const handleClickReject = () => {
    onClickReject(rowIndex);
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
        <MenuItem onClick={handleClickAccept}>Accept</MenuItem>
        <MenuItem onClick={handleClickReject}>Reject</MenuItem>
      </Menu>
    </Box>
  );
}

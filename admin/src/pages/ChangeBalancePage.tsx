import {
  Button,
  Divider,
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
  DialogActions,
  DialogContentText,
  Box,
  Slide,
  Alert,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

interface ITableRow {
  id: string;
  email: string;
  balance: number;
}

export default function ChangeBalancePage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [rows, setRows] = useState<ITableRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<ITableRow[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const containerRef = useRef<HTMLElement>(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchUserBalances();
  }, []);

  useEffect(() => {
    const visibleTableData = filteredRows.filter((data, index) => {
      console.log(page);
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

  const fetchUserBalances = async () => {
    try {
      const response = await fetch("/api/wallet");

      if (response.ok) {
        const data = await response.json();

        const usersBalance = data.map((userBalance: {
          _id: string;
          email: string;
          currency: string;
          balance: number;
        }) => ({
          id: userBalance._id,
          email: userBalance.email,
          currency: userBalance.currency,
          balance: userBalance.balance
        }));

        setRows(usersBalance);
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

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickChange = (rowIndex: number) => {
    setOpen(true);
    setSelectedRowIndex(rowIndex);
  };

  const handleFinish = (message: string) => {
    setPopUpMessage(message);
    setShowPopUp(true);
    fetchUserBalances();
  };

  return (
    <>
      <Box sx={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)" }}>
        <Slide in={showPopUp} container={containerRef.current}>
          <Alert severity="success">{popUpMessage}</Alert>
        </Slide>
      </Box>

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
                <TableCell>Balance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell>{data.id}</TableCell>
                  <TableCell>{data.email}</TableCell>
                  <TableCell>$ {data.balance.toFixed(2)}</TableCell>

                  <TableCell>
                    <Button 
                    variant="contained" 
                    onClick={() => handleClickChange(index)}
                  >
                    Change
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

        <EditForm 
          open={open} 
          onClose={handleClose} 
          rows={rows} 
          selectedRowIndex={selectedRowIndex} 
          onFinish={handleFinish}
        />
      </Paper>
    </>
  );
}

function EditForm({
  open,
  onClose,
  rows,
  selectedRowIndex,
  onFinish
}: {
  open: boolean;
  onClose: () => void;
  rows: ITableRow[];
  selectedRowIndex: number;
  onFinish: (message: string) => void;
}) {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (selectedRowIndex === -1) {
      setBalance("0");
    } else {
      setBalance(rows[selectedRowIndex].balance.toString());
    }
  }, [open]);

  const handleClickSave = async () => {
    onClose();

    try {
      const response = await fetch("/api/wallet", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: rows[selectedRowIndex].id,
          balance: parseFloat(balance)
        })
      });

      if (response.ok) {
        const data = await response.json();
        // TDOO: Give success of falid data and display an alert accourdingly.
        onFinish(data.message);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Balance</DialogTitle>

      <DialogContent>
        <DialogContentText>Change the balance of the user</DialogContentText>

        <TextField
          label="Balance"
          type="number"
          fullWidth
          variant="outlined"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleClickSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

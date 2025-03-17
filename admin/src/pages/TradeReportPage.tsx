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
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

interface ITableRow {
  _id: string;
  amount: string;
  btc1: number;
  btc2: number;
  btc3: number;
  btc4: number;
  btc5: number;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    autoFXId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    currencty: string;
    roleId: string;
    date: string;
    active: boolean;
  };
}

export default function TradeReportPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [rows, setRows] = useState<ITableRow[]>([]);
  const [filtredRows, setFilteredRows] = useState<ITableRow[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchTradeReport();
  }, []);

  useEffect(() => {
    const visibleTableData = filtredRows.filter((data, index) => {
      console.log(page);
      if (index >= page * rowsPerPage && index < (page + 1) * rowsPerPage) {
        return data;
      }
    });

    setTableData(visibleTableData);
  }, [rowsPerPage, page, filtredRows]);

  useEffect(() => {
    const filteredRows = applyFilter();
    setFilteredRows(filteredRows);
  }, [rows, searchText]);

  const applyFilter = (): ITableRow[] => {
    const searchId = rows.filter((row) => {
      return row.user.autoFXId.toString().includes(searchText);
    });

    if (searchId.length > 0) {
      return searchId;
    }

    const searchEmail = rows.filter((row) => {
      return row.user.email.includes(searchText);
    });

    if (searchEmail.length > 0) {
      return searchEmail;
    }

    return [];
  };

  const fetchTradeReport = async () => {
    try {
      const response = await fetch("/api/trades");

      if (response.ok) {
        const data = await response.json();

        const trades = data.map((trade: ITableRow) => trade);

        setRows(trades);
      } else {
        // TODO: Add an alert.
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleClickOpen = () => {
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

  const handleClickEdit = (selectedIndex: number) => {
    setSelectedRowIndex(selectedIndex + rowsPerPage * page);
    handleClickOpen();
  };

  const handleFinishEdit = () => {
    fetchTradeReport();
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

        <EditForm
          open={open}
          onClose={handleClose}
          onFinish={handleFinishEdit}
          data={tableData}
          selectedRowIndex={selectedRowIndex}
        />
      </Stack>

      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>BTC1</TableCell>
              <TableCell>BTC2</TableCell>
              <TableCell>BTC3</TableCell>
              <TableCell>BTC4</TableCell>
              <TableCell>BTC5</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((data, index) => (
              <TableRow key={data._id}>
                <TableCell>{data.user.autoFXId}</TableCell>
                <TableCell>{data.user.email}</TableCell>
                <TableCell>{data.btc1}</TableCell>
                <TableCell>{data.btc2}</TableCell>
                <TableCell>{data.btc3}</TableCell>
                <TableCell>{data.btc4}</TableCell>
                <TableCell>{data.btc5}</TableCell>
                <TableCell>$ {parseFloat(data.amount).toFixed(2)}</TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClickEdit(index)}
                  >
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

function EditForm({
  open,
  onClose,
  data,
  selectedRowIndex,
  onFinish,
}: {
  open: boolean;
  onClose: () => void;
  data: ITableRow[];
  selectedRowIndex: number;
  onFinish: () => void;
}) {
  const [tradeFormData, setTradeFormData] = useState({
    btc1: "",
    btc2: "",
    btc3: "",
    btc4: "",
    btc5: "",
    amount: "",
    remarks: "",
  });

  useEffect(() => {
    if (selectedRowIndex !== -1 && data.length > 0) {
      setTradeFormData({
        btc1: data[selectedRowIndex].btc1.toString(),
        btc2: data[selectedRowIndex].btc2.toString(),
        btc3: data[selectedRowIndex].btc3.toString(),
        btc4: data[selectedRowIndex].btc4.toString(),
        btc5: data[selectedRowIndex].btc5.toString(),
        amount: data[selectedRowIndex].amount.toString(),
        remarks: data[selectedRowIndex].remarks !== null? data[selectedRowIndex].remarks.toString() : "",
      });
    }
  }, [open]);

  const handleClickUpdate = async () => {
    try {
      const response = await fetch("/api/trades", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data[selectedRowIndex]._id,
          btc1: parseFloat(tradeFormData.btc1),
          btc2: parseFloat(tradeFormData.btc2),
          btc3: parseFloat(tradeFormData.btc3),
          btc4: parseFloat(tradeFormData.btc4),
          btc5: parseFloat(tradeFormData.btc5),
          amount: parseFloat(tradeFormData.amount),
          remarks: tradeFormData.remarks,
          isAccepted: true
        }),
      });

      if (response.ok) {
        onFinish();
        onClose();
      } else {
        console.log(await response.json());
      }
    } catch (error: any) {
      console.error(error);
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
          autoFocus
          margin="dense"
          label="BTC 1"
          type="number"
          fullWidth
          value={tradeFormData.btc1}
          onChange={(event) =>
            setTradeFormData({ ...tradeFormData, btc1: event.target.value })
          }
        />

        <TextField
          autoFocus
          margin="dense"
          label="BTC 2"
          type="number"
          fullWidth
          value={tradeFormData.btc2}
          onChange={(event) =>
            setTradeFormData({ ...tradeFormData, btc2: event.target.value })
          }
        />

        <TextField
          autoFocus
          margin="dense"
          label="BTC 3"
          type="number"
          fullWidth
          value={tradeFormData.btc3}
          onChange={(event) =>
            setTradeFormData({ ...tradeFormData, btc3: event.target.value })
          }
        />

        <TextField
          autoFocus
          margin="dense"
          label="BTC 4"
          type="number"
          fullWidth
          value={tradeFormData.btc4}
          onChange={(event) =>
            setTradeFormData({ ...tradeFormData, btc4: event.target.value })
          }
        />

        <TextField
          autoFocus
          margin="dense"
          label="BTC 5"
          type="number"
          fullWidth
          value={tradeFormData.btc5}
          onChange={(event) =>
            setTradeFormData({ ...tradeFormData, btc5: event.target.value })
          }
        />

        <TextField
          autoFocus
          margin="dense"
          label="Amount"
          type="number"
          fullWidth
          value={tradeFormData.amount}
          onChange={(event) =>
            setTradeFormData({ ...tradeFormData, amount: event.target.value })
          }
        />

        <TextField
          autoFocus
          multiline
          margin="dense"
          label="Remarks"
          type="text"
          fullWidth
          value={tradeFormData.remarks}
          onChange={(event) => setTradeFormData({ ...tradeFormData, remarks: event.target.value })}
        />
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleClickUpdate}>
          Accept and Update
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

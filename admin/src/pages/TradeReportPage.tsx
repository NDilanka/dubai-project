import { Divider, Paper, Stack, Button, Table, TableBody, TableCell, TableContainer, TableHead,
         TablePagination, TableRow, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
         DialogContentText,
       } from "@mui/material";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

interface ITableRow {
  id: string;
  username: string;
  email: string;
  btc1: number;
  btc2: number;
  btc3: number;
  btc4: number;
  btc5: number;
  amount: number;
}

const rows: ITableRow[] = [
  {
    id: "1",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "2",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "3",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "4",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "5",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "6",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "7",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "8",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "9",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "10",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "11",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
  {
    id: "12",
    username: "David Jones",
    email: "david@test.com",
    btc1: 10,
    btc2: 10,
    btc3: 10,
    btc4: 10,
    btc5: 10,
    amount: 50,
  },
];

export default function TradeReportPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const visibleTableData = rows.filter((data, index) => {
      console.log(page);
      if (index >= page * rowsPerPage && index < (page + 1) * rowsPerPage) {
        return data;
      }
    });

    setTableData(visibleTableData);
  }, [rowsPerPage, page]);

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

  return (
    <Paper variant="outlined">
      <Stack direction="row" margin={2}>
        <TextField label="Search" size="small" />

        <EditForm open={open} onClose={handleClose} />
      </Stack>

      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
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
            {tableData.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.username}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{data.btc1}</TableCell>
                <TableCell>{data.btc2}</TableCell>
                <TableCell>{data.btc3}</TableCell>
                <TableCell>{data.btc4}</TableCell>
                <TableCell>{data.btc5}</TableCell>
                <TableCell>{data.amount}</TableCell>

                <TableCell>
                  <Button variant="contained" color="primary" onClick={handleClickOpen}>
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

function EditForm({ open, onClose }: { open: boolean; onClose: () => void; }) {
  const [tradeFormData, setTradeFormData] = useState({
    btc1: "",
    btc2: "",
    btc3: "",
    btc4: "",
    btc5: "",
    amount: "",
    remarks: "",
  });

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
          onChange={(event) => setTradeFormData({ ...tradeFormData, btc1: event.target.value })}
        />

        <TextField
          autoFocus
          margin="dense"
          label="BTC 2"
          type="number"
          fullWidth
          value={tradeFormData.btc2}
          onChange={(event) => setTradeFormData({ ...tradeFormData, btc2: event.target.value })}
        />

        <TextField
          autoFocus
          margin="dense"
          label="BTC 3"
          type="number"
          fullWidth
          value={tradeFormData.btc3}
          onChange={(event) => setTradeFormData({ ...tradeFormData, btc3: event.target.value })}
        />

        <TextField
          autoFocus
          margin="dense"
          label="BTC 4"
          type="number"
          fullWidth
          value={tradeFormData.btc4}
          onChange={(event) => setTradeFormData({ ...tradeFormData, btc4: event.target.value })}
        />

        <TextField
          autoFocus
          margin="dense"
          label="BTC 5"
          type="number"
          fullWidth
          value={tradeFormData.btc5}
          onChange={(event) => setTradeFormData({ ...tradeFormData, btc5: event.target.value })}
        />

        <TextField
          autoFocus
          margin="dense"
          label="Amount"
          type="number"
          fullWidth
          value={tradeFormData.amount}
          onChange={(event) => setTradeFormData({ ...tradeFormData, amount: event.target.value })}
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
        <Button variant="contained" onClick={onClose}>Update</Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

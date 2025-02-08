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
  const [btc1, setbtc1] = useState(0)
  const [btc2, setbtc2] = useState(0)
  const [btc3, setbtc3] = useState(0)
  const [btc4, setbtc4] = useState(0)
  const [btc5, setbtc5] = useState(0)
  const [amount, setamount] = useState(0)

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
    console.log("----------------OPEN----------------");
    console.log(open);
    console.log("----------------OPEN----------------");
  };
  const handleClose = () => {
    setOpen(false);
    console.log("----------------CLOSE---------------");
    console.log(open);
    console.log("----------------CLOSE----------------");
  };

  useEffect(() => {
    const visibleTableData = rows.filter((data, index) => {
      console.log(page);
      if (index >= page * rowsPerPage && index < (page + 1) * rowsPerPage) {
        return data;
      }
    });

    setTableData(visibleTableData);
  }, [rowsPerPage, page]);

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
        <Stack direction="row" gap={1} mr="auto">
          <TextField label="Search" size="small" />
          <TextField label="Property" size="small" />
        </Stack>

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
              label="BTC 1"
              type="number"
              fullWidth
              value={btc1}
              onChange={(event) => setbtc1(parseFloat(event.target.value))}
            />
            <TextField
              margin="dense"
              id="email"
              label="BTC 2"
              type="number"
              fullWidth
              value={btc2}
              onChange={(event) => setbtc2(parseFloat(event.target.value))}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="BTC 3"
              type="number"
              fullWidth
              value={btc3}
              onChange={(event) => setbtc3(parseFloat(event.target.value))}
            />
            <TextField
              margin="dense"
              id="email"
              label="BTC 4"
              type="number"
              fullWidth
              value={btc4}
              onChange={(event) => setbtc4(parseFloat(event.target.value))}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="BTC 5"
              type="number"
              fullWidth
              value={btc5}
              onChange={(event) => setbtc5(parseFloat(event.target.value))}
            />
            <TextField
              margin="dense"
              id="email"
              label="Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(event) => setamount(parseFloat(event.target.value))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Update</Button>
          </DialogActions>
        </Dialog>

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


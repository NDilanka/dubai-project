import {
  Box,
  Typography,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Tab,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import { type ChangeEvent, type SyntheticEvent, useEffect, useState } from "react";

// Updated interface with new attributes: id, date, amount, and status
interface ITableRow {
  id: string;
  date: string;
  amount: string;
  status: "Approved" | "Pending" | "Rejected";
}

const rows: ITableRow[] = [
  { id: "2341434", date: "2024-12-01", amount: "$1000", status: "Approved" },
  { id: "sdf2341434", date: "2024-12-02", amount: "$500", status: "Pending" },
  { id: "2341434dfd", date: "2024-12-03", amount: "$750", status: "Rejected" },
  { id: "2sdf341434", date: "2024-12-04", amount: "$1200", status: "Approved" },
  { id: "sdf2341434;lsdkf", date: "2024-12-05", amount: "$300", status: "Pending" },
  { id: "2341434deiwrfd", date: "2024-12-06", amount: "$900", status: "Rejected" },
  { id: "2341434ofdnv", date: "2024-12-07", amount: "$1300", status: "Approved" },
  { id: "sdf234143wet;'adf4", date: "2024-12-08", amount: "$400", status: "Pending" },
  { id: "2341434dfdofofivnd", date: "2024-12-09", amount: "$600", status: "Rejected" },
  { id: "234143osdwe.sdf4", date: "2024-12-10", amount: "$850", status: "Approved" },
];

export default function WalletPage() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState<ITableRow[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogTabIndex, setDialogTabIndex] = useState(0);

  useEffect(() => {
    const visibleTableData = rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    setTableData(visibleTableData);
  }, [rowsPerPage, page]);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeTab = (_event: SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Depoist</DialogTitle>
        <Tabs
          value={dialogTabIndex}
          onChange={(_event: SyntheticEvent, value: number) => setDialogTabIndex(value)}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: "1px solid #ccc" }}
        >
          <Tab label="USDT" />
          <Tab label="Bank Transfer" />
          <Tab label="Cart" />
        </Tabs>
        <DialogContent sx={{ padding: "24px" }}>
          {dialogTabIndex === 0 && (
            <Box sx={{display: 'flex', flexDirection: 'column',  gap: '2rem'}}>
              <Typography variant="body1" gutterBottom>
                Wallet Address: <strong>1234-5678-9012-3456</strong>
              </Typography>

              <Box sx={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                <Typography variant="body1" gutterBottom>
                  Upload Bank Slip:
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  color="primary"
                  sx={{ marginBottom: 2 }}
                >
                  Select File
                  <input type="file" hidden accept="image/*,application/pdf" />
                </Button>
              </Box>
              <Button variant="contained" color="primary" fullWidth>
                Submit Deposit
              </Button>
            </Box>
          )}
          {dialogTabIndex === 1 && (
            <Box sx={{display: 'flex', flexDirection: 'column',  gap: '2rem'}}>

              <Typography variant="body1" >
                Contact admin to get bank details.
              </Typography>

              <Box sx={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                <Typography variant="body1" gutterBottom>
                  Upload Slip:
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  color="primary"
                  sx={{ marginBottom: 2 }}
                >
                  Select File
                  <input type="file" hidden accept="image/*,application/pdf" />
                </Button>
              </Box>
              <Button variant="contained" color="primary" fullWidth>
                Submit Deposit
              </Button>
            </Box>
          )}
          {dialogTabIndex === 2 && (
            <Box>
              <Typography>Payment Gateway</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>


      <Stack direction="column" alignItems="center">
        <Typography
          fontSize={24}
          sx={{
            opacity: 0.65,
            [theme.breakpoints.down("sm")]: {
              fontSize: 18,
            },
          }}
        >
          Balance
        </Typography>

        <Typography
          fontSize={46}
          fontWeight={700}
          sx={{
            [theme.breakpoints.down("sm")]: {
              fontSize: 28,
            },
          }}
        >
          $ 7,610.00
        </Typography>

        <Stack direction="row" gap={2} paddingTop={2.5} paddingBottom={6}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Box
              component="img"
              src="svgs/arrow-narrow-up-svgrepo-com_1.svg"
              alt=""
              sx={{
                [theme.breakpoints.down("sm")]: {
                  width: 24,
                },
              }}
            />
            <Typography>+ $ 7650.00</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" gap={0.5}>
            <Box
              component="img"
              src="svgs/arrow-narrow-up-svgrepo-com_2.svg"
              alt=""
              sx={{
                [theme.breakpoints.down("sm")]: {
                  width: 24,
                },
              }}
            />
            <Typography>- $ 7650.00</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap={1.6}>
          <Box
            component="button"
            paddingX={2.5}
            paddingY={1.5}
            borderRadius={999}
            border={1}
            borderColor="#333"
            bgcolor="transparent"
            color="white"
            fontSize={18}
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              [theme.breakpoints.down("sm")]: {
                fontSize: 14,
                paddingX: 1.5,
              },
            }}
          >
            <Box
              component="img"
              src="svgs/63011d2ad7739c0ae2d6a345_gift.svg"
              sx={{
                [theme.breakpoints.down("sm")]: {
                  width: 20,
                },
              }}
            />
            Withdraw
          </Box>

          <Box
            component="button"
            bgcolor={theme.palette.primary.main}
            color="white"
            paddingX={2.5}
            paddingY={1.5}
            border="none"
            borderRadius={999}
            fontSize={18}
            display="flex"
            alignItems="center"
            gap={1}
            onClick={handleOpenDialog}
            sx={{
              [theme.breakpoints.down("sm")]: {
                fontSize: 14,
                paddingX: 1.5,
                paddingY: 0.5,
              },
            }}
          >
            <Box
              component="img"
              src="svgs/62e275df6d0fc5b329129b81_fire.svg"
              sx={{
                [theme.breakpoints.down("sm")]: {
                  width: 20,
                },
              }}
            />
            Deposit
          </Box>
        </Stack>
      </Stack>

      <Tabs sx={{ marginTop: 16 }} value={tabIndex} onChange={handleChangeTab}>
        <Tab label="Wallet" />
        <Tab label="Withdrawals" />
      </Tabs>

      <Paper sx={{ background: "none" }}>
        <TableContainer>
          <Table sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((data) => (
                <TableRow key={data.id} sx={{ borderBottom: "1px solid #ccc" }}>
                  <TableCell>{data.id}</TableCell>
                  <TableCell>{data.date}</TableCell>
                  <TableCell>{data.amount}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 'max-content',
                        borderRadius: "32px",
                        padding: "8px 16px",
                        backgroundColor:
                          data.status === "Approved"
                            ? "green"
                            : data.status === "Pending"
                              ? "orange"
                              : "red",
                        color: "white",
                      }}
                    >
                      {data.status}
                    </Box>
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
    </Box>
  );
}

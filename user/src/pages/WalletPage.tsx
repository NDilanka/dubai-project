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
  Slide,
  Alert,
  TextField,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import { UserContext } from "../../../auth/src/context/UserContext";

// Updated interface with new attributes: id, date, amount, and status
interface IDepositTableRow {
  id: string;
  amount: string;
  usdtDepositFilePath: string;
  status: "Accepted" | "Pending" | "Rejected";
  createdAt: string;
  updatedAt: string;
}

interface IWtithdrawTableRow {
  id: string;
  amount: string;
  status: "Accepted" | "Pending" | "Rejected";
  createdAt: string;
  updatedAt: string;
}

export default function WalletPage() {
  const theme = useTheme();
  const [depositPage, setDepositPage] = useState(0);
  const [depositRowsPerPage, setDepositRowsPerPage] = useState(5);
  const [depositTableData, setDepositTableData] = useState<IDepositTableRow[]>(
    [],
  );

  const [withdrawPage, setWithdrawPage] = useState(0);
  const [withdrawRowsPerPage, setWithdrawRowsPerPage] = useState(5);
  const [withdrawTableData, setWithdrawTableData] = useState<
    IWtithdrawTableRow[]
  >([]);

  const [tabIndex, setTabIndex] = useState(0);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogTabIndex, setDialogTabIndex] = useState(0);
  const userContext = useContext(UserContext);
  const [balance, setBalance] = useState({
    value: "0",
    symbol: "$",
  });
  const [usdtDepositFile, setUsdtDepositFile] = useState<File | null>(null);
  const [bankTransferDepositFile, setBankTransferDepositFile] =
    useState<File | null>(null);

  const [usdtWithdrawFile, setUsdtWithdrawFile] = useState<File | null>(null);
  const [bankTransferWithdrawFile, setBankTransferWithdrawFile] =
    useState<File | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [trueForDepositFalseForWithdraw, setTrueForDepositFalseForWithdraw] =
    useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositRows, setDepositRows] = useState<IDepositTableRow[]>([]);
  const [withdrawRows, setWithdrawRows] = useState<IWtithdrawTableRow[]>([]);

  const [recentWithdraw, setRecentWithdraw] = useState("");
  const [recentDeposit, setRecentDeposit] = useState("");

  useEffect(() => {
    if (userContext?.user) {
      fetchDeposits(userContext.user._id);
      fetchWithdrawals(userContext.user._id);
    }
  }, [userContext?.user]);

  useEffect(() => {
    const visibleDepositTableData = depositRows.filter((data, index) => {
      if (
        index >= depositPage * depositRowsPerPage &&
        index < (depositPage + 1) * depositRowsPerPage
      ) {
        return data;
      }
    });

    setDepositTableData(visibleDepositTableData);
  }, [depositRowsPerPage, depositPage, depositRows]);

  useEffect(() => {
    const visibleWithdrawTableData = withdrawRows.filter((data, index) => {
      if (
        index >= withdrawPage * withdrawRowsPerPage &&
        index < (withdrawPage + 1) * withdrawRowsPerPage
      ) {
        return data;
      }
    });

    setWithdrawTableData(visibleWithdrawTableData);
  }, [withdrawRowsPerPage, withdrawPage, withdrawRows]);

  useEffect(() => {
    if (userContext?.user) {
      fetchBalance(userContext.user?._id);
    }
  }, [userContext?.user]);

  const fetchDeposits = async (userId: string) => {
    try {
      const response = await fetch(`/api/deposits/${userId}`);

      if (response.ok) {
        const data = await response.json();

        const deposits = data.map(
          (deposit: {
            _id: string;
            userId: string;
            amount: number;
            usdtDepositFilePath: string;
            status: string;
            createdAt: string;
            updatedAt: string;
          }) => ({
            id: deposit._id,
            userId: deposit.userId,
            amount: deposit.amount,
            usdtDepositFilePath: deposit.usdtDepositFilePath,
            status: deposit.status,
            createdAt: deposit.createdAt,
            updatedAt: deposit.updatedAt,
          }),
        );

        deposits.sort(
          (a: IDepositTableRow, b: IDepositTableRow) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        const latestDeposit = deposits.length > 0 ? deposits[0].amount : "0.00";

        setRecentDeposit(latestDeposit);

        setDepositRows(deposits);
      } else {
        // TODO: Display an error message.
      }
    } catch (error: any) {
      console.error(error);

      // TODO: Display an error message.
    }
  };

  const fetchWithdrawals = async (userId: string) => {
    try {
      const response = await fetch(`/api/withdraws/${userId}`);

      if (response.ok) {
        const data = await response.json();

        const withdraws = data.map(
          (withdraw: {
            _id: string;
            userId: string;
            amount: number;
            status: string;
            createdAt: string;
            updatedAt: string;
          }) => ({
            id: withdraw._id,
            userId: withdraw.userId,
            amount: withdraw.amount,
            status: withdraw.status,
            createdAt: withdraw.createdAt,
            updatedAt: withdraw.updatedAt,
          }),
        );

        withdraws.sort(
          (a: IDepositTableRow, b: IDepositTableRow) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        const latestWithdraw =
          withdraws.length > 0 ? withdraws[0].amount : "0.00";

        setRecentWithdraw(latestWithdraw);

        setWithdrawRows(withdraws);
      } else {
        // TODO: Display an error message.
      }
    } catch (error: any) {
      console.error(error);

      // TODO: Display an error message.
    }
  };

  const handleDepositPageChange = (_event: unknown, newPage: number) => {
    setDepositPage(newPage);
  };

  const handleDepositRowsPerPageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setDepositRowsPerPage(parseInt(event.target.value, 10));
    setDepositPage(0);
  };

  const handleWithdrawPageChange = (_event: unknown, newPage: number) => {
    setWithdrawPage(newPage);
  };

  const handleWithdrawRowsPerPageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setWithdrawRowsPerPage(parseInt(event.target.value, 10));
    setWithdrawPage(0);
  };

  const handleChangeTab = (_event: SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  const handleOpenDialog = () => {
    setTrueForDepositFalseForWithdraw(true);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const fetchBalance = async (userId: string) => {
    try {
      const response = await fetch(`/api/wallet?userId=${userId}`);

      if (response.ok) {
        const data = await response.json();
        setBalance({
          value: data.balance,
          symbol: "$",
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleChangeUsdtDepositFile = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setUsdtDepositFile(event.target.files[0]);
    }
  };

  const handleChangeBankTranserDepositFile = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setBankTransferDepositFile(event.target.files[0]);
    }
  };

  const handleSubmitUSDTDeposit = async () => {
    if (!userContext || !userContext.user) {
      return;
    }

    if (!usdtDepositFile) {
      setPopUpMessage("Please select a usdtDepositFile!");
      setShowPopUp(true);

      return;
    }

    if (depositAmount.length === 0) {
      setPopUpMessage("Please enter the amount!");
      setShowPopUp(true);

      return;
    }

    const formData = new FormData();
    formData.append("file", usdtDepositFile);
    formData.append("userId", userContext.user._id);
    formData.append("method", "USDT");
    formData.append("amount", depositAmount);

    try {
      const response = await fetch("/api/deposits", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPopUpMessage(data.message);
        setShowPopUp(true);
        setUsdtDepositFile(null);
        setDialogOpen(false);
        await fetchDeposits(userContext.user._id);
      } else {
        // TODO: Display an error.
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitBankTransformDeposit = async () => {
    if (!userContext || !userContext.user) {
      return;
    }

    if (!bankTransferDepositFile) {
      setPopUpMessage("Please select a usdtDepositFile!");
      setShowPopUp(true);

      return;
    }

    if (depositAmount.length === 0) {
      setPopUpMessage("Please enter the amount!");
      setShowPopUp(true);

      return;
    }

    const formData = new FormData();
    formData.append("file", bankTransferDepositFile);
    formData.append("userId", userContext.user._id);
    formData.append("method", "BankTransfer");
    formData.append("amount", depositAmount);

    try {
      const response = await fetch("/api/deposits", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPopUpMessage(data.message);
        setShowPopUp(true);
        setUsdtDepositFile(null);
        setDialogOpen(false);
        await fetchDeposits(userContext.user._id);
      } else {
        // TODO: Display an error.
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickWithdraw = () => {
    setTrueForDepositFalseForWithdraw(false);
    setDialogOpen(true);
  };

  const handleSubmitWithdraw = async () => {
    if (!userContext || !userContext.user) {
      return;
    }

    if (withdrawAmount.length === 0) {
      setPopUpMessage("Please enter the amount!");
      setShowPopUp(true);

      return;
    }

    try {
      const response = await fetch("/api/withdraws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userContext.user._id,
          amount: parseFloat(withdrawAmount),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPopUpMessage(data.message);
        setShowPopUp(true);
        setDialogOpen(false);
        await fetchWithdrawals(userContext.user._id);
      } else {
        // TODO: Display an error.
      }
    } catch (error) {
      console.error(error);
    }
  };

  const convertBalance = (balance: number, type: string) => {
    let symbol = type === "EUR" ? "€" : type === "INR" ? "₹" : "$";
    let convertRate = type == "EUR" ? 1 : type == "INR" ? 1 : 1;
    let newValue = (balance * convertRate).toString();
    setBalance({ value: newValue, symbol: symbol });
  };

  const handleCurrencyChange = async (event: SelectChangeEvent<string>) => {
    convertBalance(parseFloat(balance.value), event.target.value);
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

      <Box>
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          {trueForDepositFalseForWithdraw ? (
            <>
              <DialogTitle>Deposit</DialogTitle>

              <Tabs
                value={dialogTabIndex}
                onChange={(_event: SyntheticEvent, value: number) =>
                  setDialogTabIndex(value)
                }
                indicatorColor="primary"
                textColor="primary"
                sx={{ borderBottom: "1px solid #ccc" }}
              >
                <Tab label="USDT" />
                <Tab label="Bank Transfer" />
              </Tabs>

              <DialogContent sx={{ padding: "24px" }}>
                {dialogTabIndex === 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2rem",
                    }}
                  >
                    <Typography variant="body1" gutterBottom>
                      Wallet Address: <strong>1234-5678-9012-3456</strong>
                    </Typography>

                    {usdtDepositFile && (
                      <Box>
                        <Typography>
                          Selected File: {usdtDepositFile.name}
                        </Typography>
                        {usdtDepositFile.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(usdtDepositFile)}
                            alt="Selected Deposit Slip"
                            style={{
                              height: "100px",
                              objectFit: "cover",
                              marginTop: "10px",
                            }}
                          />
                        )}
                      </Box>
                    )}

                    <TextField
                      variant="outlined"
                      label="Amount"
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                      }}
                    >
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
                        <input
                          type="file"
                          hidden
                          accept="image/*,application/pdf"
                          onChange={handleChangeUsdtDepositFile}
                        />
                      </Button>
                    </Box>

                    <Button
                      fullWidth
                      disabled={
                        usdtDepositFile === null || depositAmount.length === 0
                      }
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitUSDTDeposit}
                    >
                      Submit Deposit
                    </Button>
                  </Box>
                )}
                {dialogTabIndex === 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2rem",
                    }}
                  >
                    <Typography variant="body1">
                      Contact admin to get bank details.
                    </Typography>

                    {bankTransferDepositFile && (
                      <Box>
                        <Typography>
                          Selected File: {bankTransferDepositFile.name}
                        </Typography>
                        {bankTransferDepositFile.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(bankTransferDepositFile)}
                            alt="Selected Bank Slip"
                            style={{
                              height: "100px",
                              objectFit: "cover",
                              marginTop: "10px",
                            }}
                          />
                        )}
                      </Box>
                    )}

                    <TextField
                      variant="outlined"
                      label="Amount"
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                      }}
                    >
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
                        <input
                          type="file"
                          hidden
                          accept="image/*,application/pdf"
                          onChange={handleChangeBankTranserDepositFile}
                        />
                      </Button>
                    </Box>

                    <Button
                      fullWidth
                      disabled={
                        bankTransferDepositFile === null ||
                        depositAmount.length === 0
                      }
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitBankTransformDeposit}
                    >
                      Submit Deposit
                    </Button>
                  </Box>
                )}
              </DialogContent>
            </>
          ) : (
            <>
              <DialogTitle>Withdraw</DialogTitle>

              <Tabs
                value={dialogTabIndex}
                onChange={(_event: SyntheticEvent, value: number) =>
                  setDialogTabIndex(value)
                }
                indicatorColor="primary"
                textColor="primary"
                sx={{ borderBottom: "1px solid #ccc" }}
              >
                <Tab label="USDT" />
              </Tabs>

              <DialogContent sx={{ padding: "24px" }}>
                {dialogTabIndex === 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2rem",
                    }}
                  >
                    <TextField
                      variant="outlined"
                      label="Amount"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />

                    <Button
                      fullWidth
                      disabled={
                        withdrawAmount.length === 0 && usdtWithdrawFile !== null
                      }
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitWithdraw}
                    >
                      Submit Withdraw
                    </Button>
                  </Box>
                )}
                {dialogTabIndex === 2 && (
                  <Box>
                    <Typography>Payment Gateway</Typography>
                  </Box>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>

        <Stack direction="column" alignItems="center">
          <Stack direction="row" alignItems="center">
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
            <Select
              variant="standard"
              disableUnderline
              onChange={handleCurrencyChange}
              displayEmpty
              renderValue={(selected) => (selected ? "" : "")}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
            </Select>
          </Stack>

          <Typography
            fontSize={46}
            fontWeight={700}
            sx={{
              [theme.breakpoints.down("sm")]: {
                fontSize: 28,
              },
            }}
          >
            {balance.symbol} {parseFloat(balance.value).toFixed(2)}
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
              <Typography>+ ${recentDeposit}</Typography>
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
              <Typography>- ${recentWithdraw}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" gap={1.6}>
            <Box
              onClick={handleClickWithdraw}
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
                cursor: "pointer",
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
                cursor: "pointer",
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

        <Tabs
          sx={{ marginTop: 16 }}
          value={tabIndex}
          onChange={handleChangeTab}
        >
          <Tab label="Deposits" />
          <Tab label="Withdrawals" />
        </Tabs>

        {tabIndex === 0 && (
          <Paper sx={{ background: "none" }}>
            <TableContainer>
              <Table
                sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {depositTableData.map((data) => {
                    const date = new Date(data.createdAt);
                    return (
                      <TableRow
                        key={data.id}
                        sx={{ borderBottom: "1px solid #ccc" }}
                      >
                        <TableCell>{data.id}</TableCell>
                        <TableCell>
                          {date.getDate()}/{date.getMonth() + 1}/
                          {date.getFullYear()}
                        </TableCell>
                        <TableCell>
                          {parseFloat(data.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: "max-content",
                              borderRadius: "32px",
                              padding: "8px 16px",
                              backgroundColor:
                                data.status === "Accepted"
                                  ? "green"
                                  : data.status === "Rejected"
                                    ? "red"
                                    : "orange",
                              color: "white",
                            }}
                          >
                            {data.status}
                          </Box>
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
              count={depositTableData.length}
              rowsPerPage={depositRowsPerPage}
              page={depositPage}
              onPageChange={handleDepositPageChange}
              onRowsPerPageChange={handleDepositRowsPerPageChange}
            />
          </Paper>
        )}

        {tabIndex === 1 && (
          <Paper sx={{ background: "none" }}>
            <TableContainer>
              <Table
                sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {withdrawTableData.map((data) => {
                    const date = new Date(data.createdAt);
                    return (
                      <TableRow
                        key={data.id}
                        sx={{ borderBottom: "1px solid #ccc" }}
                      >
                        <TableCell>{data.id}</TableCell>
                        <TableCell>
                          {date.getDate()}/{date.getMonth() + 1}/
                          {date.getFullYear()}
                        </TableCell>
                        <TableCell>
                          $ {parseFloat(data.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: "max-content",
                              borderRadius: "32px",
                              padding: "8px 16px",
                              backgroundColor:
                                data.status === "Accepted"
                                  ? "green"
                                  : data.status === "Rejected"
                                    ? "red"
                                    : "orange",
                              color: "white",
                            }}
                          >
                            {data.status}
                          </Box>
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
              count={withdrawTableData.length}
              rowsPerPage={withdrawRowsPerPage}
              page={withdrawPage}
              onPageChange={handleWithdrawPageChange}
              onRowsPerPageChange={handleWithdrawRowsPerPageChange}
            />
          </Paper>
        )}
      </Box>
    </>
  );
}

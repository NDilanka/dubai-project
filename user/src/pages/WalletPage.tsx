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
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for the balance state
interface IWalletBalance {
  value: string;
  symbol: string;
  currencyCode: string;
}

// Helper function to get currency symbols
const getCurrencySymbol = (currencyCode: string): string => {
  switch (currencyCode?.toUpperCase()) {
    case "USD":
      return "$";
    case "CAD":
      return "CA$";
    case "INR":
      return "₹";
    default:
      return "$"; // Fallback symbol
  }
};

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

  const [balance, setBalance] = useState<IWalletBalance>({
    value: "0",
    symbol: "$", // Default symbol
    currencyCode: "USD", // Default currency code
  });

  const [usdtDepositFile, setUsdtDepositFile] = useState<File | null>(null);
  const [bankTransferDepositFile, setBankTransferDepositFile] =
    useState<File | null>(null);

  const [usdtWithdrawFile, setUsdtWithdrawFile] = useState<File | null>(null);
  // const [bankTransferWithdrawFile, setBankTransferWithdrawFile] = useState<File | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [trueForDepositFalseForWithdraw, setTrueForDepositFalseForWithdraw] =
    useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositRows, setDepositRows] = useState<IDepositTableRow[]>([]);
  const [withdrawRows, setWithdrawRows] = useState<IWtithdrawTableRow[]>([]);

  const [recentWithdraw, setRecentWithdraw] = useState("0.00");
  const [recentDeposit, setRecentDeposit] = useState("0.00");

  const [username, setUsername] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountnumber, setAccountnumber] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [branch, setBranch] = useState("");
  const [upiAddress, setUpiAddress] = useState("");

  const [showRemarksPopUp, setShowRemarksPopUp] = useState(false);
  const [selectedRowRemarks, setSelectedRowRemarks] = useState("");

  useEffect(() => {
    if (userContext?.user?._id) {
      fetchDeposits(userContext.user._id);
      fetchWithdrawals(userContext.user._id);
      fetchBalance(userContext.user._id);
    }
  }, [userContext?.user]);

  useEffect(() => {
    const visibleDepositTableData = depositRows.slice(
      depositPage * depositRowsPerPage,
      depositPage * depositRowsPerPage + depositRowsPerPage,
    );
    setDepositTableData(visibleDepositTableData);
  }, [depositRowsPerPage, depositPage, depositRows]);

  useEffect(() => {
    const visibleWithdrawTableData = withdrawRows.slice(
      withdrawPage * withdrawRowsPerPage,
      withdrawPage * withdrawRowsPerPage + withdrawRowsPerPage,
    );
    setWithdrawTableData(visibleWithdrawTableData);
  }, [withdrawRowsPerPage, withdrawPage, withdrawRows]);

  const fetchDeposits = async (userId: string) => {
    try {
      const response = await fetch(`/api/deposits/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const deposits: IDepositTableRow[] = data.map((deposit: any) => ({
          id: deposit._id,
          userId: deposit.userId,
          amount: String(deposit.amount),
          usdtDepositFilePath: deposit.usdtDepositFilePath,
          status: deposit.status,
          createdAt: deposit.createdAt,
          updatedAt: deposit.updatedAt,
        }));
        deposits.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const latestDepositAmount =
          deposits.length > 0 ? deposits[0].amount : "0.00";
        setRecentDeposit(latestDepositAmount);
        setDepositRows(deposits);
      } else {
        console.error("Failed to fetch deposits");
        // TODO: Display an error message.
      }
    } catch (error: any) {
      console.error("Error fetching deposits:", error);
      // TODO: Display an error message.
    }
  };

  const fetchWithdrawals = async (userId: string) => {
    try {
      const response = await fetch(`/api/withdraws/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const withdraws: IWtithdrawTableRow[] = data.map((withdraw: any) => ({
          id: withdraw._id,
          userId: withdraw.userId,
          amount: String(withdraw.amount),
          status: withdraw.status,
          remarks: withdraw.remarks,
          createdAt: withdraw.createdAt,
          updatedAt: withdraw.updatedAt,
        }));
        withdraws.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const latestWithdrawAmount =
          withdraws.length > 0 ? withdraws[0].amount : "0.00";
        setRecentWithdraw(latestWithdrawAmount);
        setWithdrawRows(withdraws);
      } else {
        console.error("Failed to fetch withdrawals");
        // TODO: Display an error message.
      }
    } catch (error: any) {
      console.error("Error fetching withdrawals:", error);
      // TODO: Display an error message.
    }
  };

  const fetchBalance = async (userId: string) => {
    try {
      const response = await fetch(`/api/wallet?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const currencyCode =
          typeof data.currency === "string" ? data.currency : "USD";
        const symbol = getCurrencySymbol(currencyCode);
        setBalance({
          value: data.balance || "0",
          symbol: symbol,
          currencyCode: currencyCode,
        });
      } else {
        console.error("Failed to fetch balance. Response not OK.");
        setBalance({
          value: "0",
          symbol: getCurrencySymbol("USD"),
          currencyCode: "USD",
        });
      }
    } catch (error: any) {
      console.error("Error fetching balance:", error);
      setBalance({
        value: "0",
        symbol: getCurrencySymbol("USD"),
        currencyCode: "USD",
      });
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
    // Reset dialog specific states
    setDialogTabIndex(0);
    setDepositAmount("");
    setWithdrawAmount("");
    setUsdtDepositFile(null);
    setBankTransferDepositFile(null);
    // Reset bank transfer withdraw form fields
    setUsername("");
    setBankName("");
    setAccountnumber("");
    setIFSC("");
    setBranch("");
    setUpiAddress("");
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
      setPopUpMessage("User not found. Please log in again.");
      setShowPopUp(true);
      return;
    }
    if (!usdtDepositFile) {
      setPopUpMessage("Please select a USDT deposit slip!");
      setShowPopUp(true);
      return;
    }
    if (depositAmount.length === 0 || parseFloat(depositAmount) <= 0) {
      setPopUpMessage("Please enter a valid deposit amount!");
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
      const responseData = await response.json();
      setPopUpMessage(
        responseData.message ||
          (response.ok
            ? "Deposit submitted successfully!"
            : "Deposit submission failed."),
      );
      setShowPopUp(true);
      if (response.ok) {
        setUsdtDepositFile(null);
        setDepositAmount("");
        setDialogOpen(false);
        await fetchDeposits(userContext.user._id);
        await fetchBalance(userContext.user._id);
      } else {
        // TODO: Display a more specific error from responseData if available.
      }
    } catch (error) {
      console.error(error);
      setPopUpMessage("An error occurred during USDT deposit.");
      setShowPopUp(true);
    }
  };

  const handleSubmitBankTransformDeposit = async () => {
    if (!userContext || !userContext.user) {
      setPopUpMessage("User not found. Please log in again.");
      setShowPopUp(true);
      return;
    }
    if (!bankTransferDepositFile) {
      setPopUpMessage("Please select a bank transfer slip!");
      setShowPopUp(true);
      return;
    }
    if (depositAmount.length === 0 || parseFloat(depositAmount) <= 0) {
      setPopUpMessage("Please enter a valid deposit amount!");
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
      const responseData = await response.json();
      setPopUpMessage(
        responseData.message ||
          (response.ok
            ? "Deposit submitted successfully!"
            : "Deposit submission failed."),
      );
      setShowPopUp(true);
      if (response.ok) {
        setBankTransferDepositFile(null);
        setDepositAmount("");
        setDialogOpen(false);
        await fetchDeposits(userContext.user._id);
        await fetchBalance(userContext.user._id); // Refresh balance
      } else {
        // TODO: Display an error.
      }
    } catch (error) {
      console.error(error);
      setPopUpMessage("An error occurred during bank transfer deposit.");
      setShowPopUp(true);
    }
  };

  const handleClickWithdraw = () => {
    setTrueForDepositFalseForWithdraw(false);
    setDialogOpen(true);
  };

  const handleSubmitWithdraw = async () => {
    if (!userContext || !userContext.user) {
      setPopUpMessage("User not found. Please log in again.");
      setShowPopUp(true);
      return;
    }
    if (withdrawAmount.length === 0 || parseFloat(withdrawAmount) <= 0) {
      setPopUpMessage("Please enter a valid withdraw amount!");
      setShowPopUp(true);
      return;
    }
    // Basic validation for sufficient balance (client-side, backend should re-validate)
    if (parseFloat(withdrawAmount) > parseFloat(balance.value)) {
      setPopUpMessage("Insufficient balance for this withdrawal amount.");
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
          method: "USDT", // Assuming USDT for this tab
        }),
      });
      const responseData = await response.json();
      setPopUpMessage(
        responseData.message ||
          (response.ok
            ? "Withdrawal request submitted!"
            : "Withdrawal request failed."),
      );
      setShowPopUp(true);
      if (response.ok) {
        setWithdrawAmount("");
        setDialogOpen(false);
        await fetchWithdrawals(userContext.user._id);
        await fetchBalance(userContext.user._id); // Refresh balance
      } else {
        // TODO: Display an error.
      }
    } catch (error) {
      console.error(error);
      setPopUpMessage("An error occurred during USDT withdrawal.");
      setShowPopUp(true);
    }
  };

  const handleSubmitBankTransferWithdraw = async () => {
    if (!userContext || !userContext.user) {
      setPopUpMessage("User not found. Please log in again.");
      setShowPopUp(true);
      return;
    }
    if (withdrawAmount.length === 0 || parseFloat(withdrawAmount) <= 0) {
      setPopUpMessage("Please enter a valid withdraw amount!");
      setShowPopUp(true);
      return;
    }
    if (parseFloat(withdrawAmount) > parseFloat(balance.value)) {
      setPopUpMessage("Insufficient balance for this withdrawal amount.");
      setShowPopUp(true);
      return;
    }
    if (
      !username.trim() ||
      !bankName.trim() ||
      !accountnumber.trim() ||
      !IFSC.trim() ||
      !branch.trim()
    ) {
      setPopUpMessage("Please fill all bank details for withdrawal.");
      setShowPopUp(true);
      return;
    }

    try {
      const response = await fetch("/api/withdraw-bank-transfer-request", {
        // Ensure this endpoint exists
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userContext.user._id,
          amount: parseFloat(withdrawAmount),
          username: username,
          bankName: bankName,
          accountnumber: accountnumber,
          IFSC: IFSC,
          branch: branch,
          upiAddress: upiAddress, // Optional, can be empty if not required
          method: "BankTransfer",
        }),
      });
      const responseData = await response.json();
      setPopUpMessage(
        responseData.message ||
          (response.ok
            ? "Bank transfer withdrawal request submitted!"
            : "Bank transfer withdrawal request failed."),
      );
      setShowPopUp(true);
      if (response.ok) {
        setWithdrawAmount("");
        // Reset bank form fields
        setUsername("");
        setBankName("");
        setAccountnumber("");
        setIFSC("");
        setBranch("");
        setUpiAddress("");
        setDialogOpen(false);
        await fetchWithdrawals(userContext.user._id);
        await fetchBalance(userContext.user._id); // Refresh balance
      } else {
        // TODO: Display an error.
      }
    } catch (error) {
      console.error(error);
      setPopUpMessage("An error occurred during bank transfer withdrawal.");
      setShowPopUp(true);
    }
  };

  // This function is for client-side display conversion if the Select dropdown is used.
  // Note: convertRate logic is placeholder. Real exchange rates would be needed for actual value conversion.
  const convertBalance = (
    currentBalanceValue: number,
    targetCurrencyCode: string,
  ) => {
    const newSymbol = getCurrencySymbol(targetCurrencyCode);
    // Placeholder for actual conversion logic. Currently, it only changes the symbol and currency code.
    // let exchangeRate = 1; // Fetch or define exchange rates here
    // if (balance.currencyCode === "USD" && targetCurrencyCode === "EUR") exchangeRate = 0.9; // Example
    // if (balance.currencyCode === "EUR" && targetCurrencyCode === "USD") exchangeRate = 1.1; // Example
    // const newValue = (currentBalanceValue * exchangeRate).toString();

    // For now, assuming the value doesn't change with this UI interaction, only the display preference
    setBalance({
      value: currentBalanceValue.toString(), // Or newValue if using real rates
      symbol: newSymbol,
      currencyCode: targetCurrencyCode,
    });
  };

  const handleCurrencyChange = async (event: SelectChangeEvent<string>) => {
    // This would be for a user changing their preferred display currency.
    // If your backend handles all currency logic, this might not be needed,
    // or it would trigger a backend call to update user preference and get converted balance.
    // For now, it calls the client-side convertBalance.
    convertBalance(parseFloat(balance.value), event.target.value);
  };

  const handleCloseRemarksPopUp = () => {
    setShowRemarksPopUp(false);
    setSelectedRowRemarks("");
  };

  const handleClickViewRemarks = (remarks: string) => {
    setSelectedRowRemarks(remarks || "No remarks provided.");
    setShowRemarksPopUp(true);
  };

  // Effect to hide pop-up message after a few seconds
  useEffect(() => {
    if (showPopUp) {
      const timer = setTimeout(() => {
        setShowPopUp(false);
        setPopUpMessage("");
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showPopUp]);

  return (
    <>
      <Box
        sx={{
          position: "fixed", // Use fixed to ensure it's on top of other content
          left: "50%",
          top: "20px", // Adjust position as needed
          transform: "translateX(-50%)",
          zIndex: theme.zIndex.modal + 1, // Ensure it's above dialogs
          minWidth: "250px", // Ensure a minimum width
        }}
        ref={containerRef} // containerRef is for Slide, ensure it's appropriate or remove if not used by Slide
      >
        <Slide direction="down" in={showPopUp} container={containerRef.current}>
          <Alert
            severity={
              popUpMessage.toLowerCase().includes("fail") ||
              popUpMessage.toLowerCase().includes("error")
                ? "error"
                : "success"
            }
            onClose={() => setShowPopUp(false)}
          >
            {popUpMessage}
          </Alert>
        </Slide>
      </Box>

      <Box>
        <Dialog open={showRemarksPopUp} onClose={handleCloseRemarksPopUp}>
          <DialogTitle>Withdrawal Remarks</DialogTitle>
          <DialogContent>
            <Typography>{selectedRowRemarks}</Typography>
          </DialogContent>
          <Button onClick={handleCloseRemarksPopUp} sx={{ margin: 2 }}>
            Close
          </Button>
        </Dialog>
      </Box>

      <Box>
        {" "}
        {/* Main content Box */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          {trueForDepositFalseForWithdraw ? (
            <>
              <DialogTitle>
                Deposit to Your Wallet ({balance.symbol})
              </DialogTitle>
              <Tabs
                value={dialogTabIndex}
                onChange={(_event: SyntheticEvent, value: number) =>
                  setDialogTabIndex(value)
                }
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="USDT" />
                <Tab label="Bank Transfer" />
              </Tabs>
              <DialogContent sx={{ padding: "24px" }}>
                {dialogTabIndex === 0 && ( // USDT Deposit
                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitUSDTDeposit();
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    <Typography variant="body1" gutterBottom>
                      Wallet Address for USDT (TRC20):{" "}
                      <strong>YOUR_USDT_WALLET_ADDRESS_HERE</strong>
                    </Typography>
                    <TextField
                      variant="outlined"
                      label={`Amount to Deposit (${balance.symbol})`}
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      inputProps={{ min: "0.01", step: "0.01" }}
                      required
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      color="primary"
                    >
                      Upload Payment Screenshot
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={handleChangeUsdtDepositFile}
                      />
                    </Button>
                    {usdtDepositFile && (
                      <Box textAlign="center">
                        <Typography variant="caption">
                          Selected: {usdtDepositFile.name}
                        </Typography>
                        {usdtDepositFile.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(usdtDepositFile)}
                            alt="USDT Deposit Slip Preview"
                            style={{
                              maxHeight: "150px",
                              objectFit: "contain",
                              marginTop: "10px",
                              border: "1px solid #ccc",
                            }}
                          />
                        )}
                      </Box>
                    )}
                    <Button
                      type="submit"
                      fullWidth
                      disabled={
                        !usdtDepositFile ||
                        !depositAmount ||
                        parseFloat(depositAmount) <= 0
                      }
                      variant="contained"
                      color="primary"
                    >
                      Submit USDT Deposit
                    </Button>
                  </Box>
                )}
                {dialogTabIndex === 1 && ( // Bank Transfer Deposit
                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitBankTransformDeposit();
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    <Typography variant="body1" gutterBottom>
                      Please contact admin or check instructions for bank
                      account details. After transferring, upload the payment
                      proof.
                    </Typography>
                    <TextField
                      variant="outlined"
                      label={`Amount Deposited (${balance.symbol})`}
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      inputProps={{ min: "0.01", step: "0.01" }}
                      required
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      color="primary"
                    >
                      Upload Payment Proof
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={handleChangeBankTranserDepositFile}
                      />
                    </Button>
                    {bankTransferDepositFile && (
                      <Box textAlign="center">
                        <Typography variant="caption">
                          Selected: {bankTransferDepositFile.name}
                        </Typography>
                        {bankTransferDepositFile.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(bankTransferDepositFile)}
                            alt="Bank Transfer Slip Preview"
                            style={{
                              maxHeight: "150px",
                              objectFit: "contain",
                              marginTop: "10px",
                              border: "1px solid #ccc",
                            }}
                          />
                        )}
                      </Box>
                    )}
                    <Button
                      type="submit"
                      fullWidth
                      disabled={
                        !bankTransferDepositFile ||
                        !depositAmount ||
                        parseFloat(depositAmount) <= 0
                      }
                      variant="contained"
                      color="primary"
                    >
                      Submit Bank Transfer Deposit
                    </Button>
                  </Box>
                )}
              </DialogContent>
            </>
          ) : (
            // Withdraw Dialog
            <>
              <DialogTitle>Withdraw Funds ({balance.symbol})</DialogTitle>
              <Tabs
                value={dialogTabIndex}
                onChange={(_event: SyntheticEvent, value: number) =>
                  setDialogTabIndex(value)
                }
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="USDT" />
                <Tab label="Bank Transfer" />
              </Tabs>
              <DialogContent sx={{ padding: "24px" }}>
                {dialogTabIndex === 0 && ( // USDT Withdraw
                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitWithdraw();
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    <Typography variant="body1" gutterBottom>
                      Enter your USDT (TRC20) Wallet Address and amount to
                      withdraw.
                    </Typography>
                    {/* You'll need a TextField for the user's USDT address here */}
                    {/* <TextField label="Your USDT (TRC20) Address" variant="outlined" required /> */}
                    <TextField
                      variant="outlined"
                      label={`Amount to Withdraw (${balance.symbol})`}
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      inputProps={{
                        min: "0.01",
                        step: "0.01",
                        max: balance.value,
                      }}
                      required
                    />
                    <Button
                      type="submit"
                      fullWidth
                      disabled={
                        !withdrawAmount ||
                        parseFloat(withdrawAmount) <= 0 ||
                        parseFloat(withdrawAmount) > parseFloat(balance.value)
                      }
                      variant="contained"
                      color="primary"
                    >
                      Submit USDT Withdraw Request
                    </Button>
                  </Box>
                )}
                {dialogTabIndex === 1 && ( // Bank Transfer Withdraw
                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitBankTransferWithdraw();
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }} // Reduced gap for more fields
                  >
                    <TextField
                      variant="outlined"
                      label="Account Holder Name"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <TextField
                      variant="outlined"
                      label="Bank Name"
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                    />
                    <TextField
                      variant="outlined"
                      label="Account Number"
                      type="text"
                      value={accountnumber}
                      onChange={(e) => setAccountnumber(e.target.value)}
                      required
                    />
                    <TextField
                      variant="outlined"
                      label="IFSC Code"
                      type="text"
                      value={IFSC}
                      onChange={(e) => setIFSC(e.target.value)}
                      required
                    />
                    <TextField
                      variant="outlined"
                      label="Bank Branch"
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                    />
                    <TextField
                      variant="outlined"
                      label="UPI Address (Optional)"
                      type="text"
                      value={upiAddress}
                      onChange={(e) => setUpiAddress(e.target.value)}
                    />
                    <TextField
                      variant="outlined"
                      label={`Amount to Withdraw (${balance.symbol})`}
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      inputProps={{
                        min: "0.01",
                        step: "0.01",
                        max: balance.value,
                      }}
                      required
                    />
                    <Button
                      type="submit"
                      fullWidth
                      disabled={
                        !withdrawAmount ||
                        parseFloat(withdrawAmount) <= 0 ||
                        parseFloat(withdrawAmount) >
                          parseFloat(balance.value) ||
                        !username.trim() ||
                        !bankName.trim() ||
                        !accountnumber.trim() ||
                        !IFSC.trim() ||
                        !branch.trim()
                      }
                      variant="contained"
                      color="primary"
                    >
                      Submit Bank Transfer Withdraw Request
                    </Button>
                  </Box>
                )}
              </DialogContent>
            </>
          )}
          <Button onClick={handleCloseDialog} sx={{ margin: 2, marginTop: 0 }}>
            Cancel
          </Button>
        </Dialog>
        <Stack direction="column" alignItems="center" mt={4}>
          <Stack direction="row" alignItems="center">
            <Typography
              fontSize={24}
              sx={{
                opacity: 0.65,
                [theme.breakpoints.down("sm")]: { fontSize: 18 },
              }}
            >
              Wallet Balance
            </Typography>
            {/*
            <Select
              variant="standard"
              disableUnderline
              value={balance.currencyCode} // Control with state
              onChange={handleCurrencyChange}
              displayEmpty
              sx={{ ml: 1, fontSize: 18, opacity: 0.65 }}
              // renderValue={(selected) => (selected ? selected.toUpperCase() : "")}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
            </Select>
            */}
          </Stack>

          <Typography
            fontSize={46}
            fontWeight={700}
            sx={{ [theme.breakpoints.down("sm")]: { fontSize: 28 } }}
          >
            {balance.symbol}{" "}
            {parseFloat(balance.value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>

          <Stack direction="row" gap={2} paddingTop={2.5} paddingBottom={6}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Box
                component="img"
                src="/svgs/arrow-narrow-up-svgrepo-com_1.svg" // Assuming svgs are in public/svgs
                alt="deposit icon"
                sx={{ [theme.breakpoints.down("sm")]: { width: 24 } }}
              />
              <Typography>
                + {balance.symbol}
                {parseFloat(recentDeposit).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Box
                component="img"
                src="/svgs/arrow-narrow-up-svgrepo-com_2.svg" // Assuming svgs are in public/svgs
                alt="withdraw icon"
                sx={{ [theme.breakpoints.down("sm")]: { width: 24 } }}
              />
              <Typography>
                - {balance.symbol}
                {parseFloat(recentWithdraw).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" gap={1.6}>
            <Button
              variant="outlined"
              onClick={handleClickWithdraw}
              startIcon={
                <Box
                  component="img"
                  src="/svgs/63011d2ad7739c0ae2d6a345_gift.svg"
                  sx={{
                    width: 20,
                    height: 20,
                    [theme.breakpoints.down("sm")]: { width: 18 },
                  }}
                />
              }
              sx={{
                borderRadius: "999px",
                paddingX: { xs: 1.5, sm: 2.5 },
                paddingY: { xs: 0.75, sm: 1.5 },
                fontSize: { xs: 14, sm: 18 },
                textTransform: "none",
              }}
            >
              Withdraw
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenDialog}
              startIcon={
                <Box
                  component="img"
                  src="/svgs/62e275df6d0fc5b329129b81_fire.svg"
                  sx={{
                    width: 20,
                    height: 20,
                    [theme.breakpoints.down("sm")]: { width: 18 },
                  }}
                />
              }
              sx={{
                borderRadius: "999px",
                paddingX: { xs: 1.5, sm: 2.5 },
                paddingY: { xs: 0.75, sm: 1.5 },
                fontSize: { xs: 14, sm: 18 },
                textTransform: "none",
              }}
            >
              Deposit
            </Button>
          </Stack>
        </Stack>
        <Tabs
          sx={{
            marginTop: { xs: 4, sm: 8 },
            borderBottom: 1,
            borderColor: "divider",
          }} // Adjusted marginTop
          value={tabIndex}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Deposits" />
          <Tab label="Withdrawals" />
        </Tabs>
        {tabIndex === 0 && ( // Deposits Tab
          <Paper sx={{ background: "transparent", boxShadow: "none", mt: 2 }}>
            <TableContainer>
              <Table
                sx={{
                  borderCollapse: "separate",
                  borderSpacing: "0 8px",
                  minWidth: 650,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Proof</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {depositTableData.map((data) => {
                    const date = new Date(data.createdAt);
                    return (
                      <TableRow
                        key={data.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: theme.palette.action.hover,
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            fontSize: "0.75rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100px",
                          }}
                          title={data.id}
                        >
                          {data.id.length > 10
                            ? `${data.id.substring(0, 10)}...`
                            : data.id}
                        </TableCell>
                        <TableCell>
                          {date.toLocaleDateString()}{" "}
                          {date.toLocaleTimeString()}
                        </TableCell>
                        <TableCell align="right">
                          {balance.symbol}
                          {parseFloat(data.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: "max-content",
                              borderRadius: "32px",
                              padding: "6px 12px", // Adjusted padding
                              fontSize: "0.75rem", // Adjusted font size
                              color: "white",
                              backgroundColor:
                                data.status === "Accepted"
                                  ? theme.palette.success.main
                                  : data.status === "Rejected"
                                    ? theme.palette.error.main
                                    : theme.palette.warning.main,
                            }}
                          >
                            {data.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {data.usdtDepositFilePath && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                window.open(
                                  `/uploads/${data.usdtDepositFilePath}`,
                                  "_blank",
                                )
                              } // Adjust path as needed
                            >
                              View
                            </Button>
                          )}
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
              count={depositRows.length}
              rowsPerPage={depositRowsPerPage}
              page={depositPage}
              onPageChange={handleDepositPageChange}
              onRowsPerPageChange={handleDepositRowsPerPageChange}
            />
          </Paper>
        )}
        {tabIndex === 1 && ( // Withdrawals Tab
          <Paper sx={{ background: "transparent", boxShadow: "none", mt: 2 }}>
            <TableContainer>
              <Table
                sx={{
                  borderCollapse: "separate",
                  borderSpacing: "0 8px",
                  minWidth: 650,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawTableData.map((data) => {
                    const date = new Date(data.createdAt);
                    return (
                      <TableRow
                        key={data.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: theme.palette.action.hover,
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            fontSize: "0.75rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100px",
                          }}
                          title={data.id}
                        >
                          {data.id.length > 10
                            ? `${data.id.substring(0, 10)}...`
                            : data.id}
                        </TableCell>
                        <TableCell>
                          {date.toLocaleDateString()}{" "}
                          {date.toLocaleTimeString()}
                        </TableCell>
                        <TableCell align="right">
                          {balance.symbol}
                          {parseFloat(data.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: "max-content",
                              borderRadius: "32px",
                              padding: "6px 12px",
                              fontSize: "0.75rem",
                              color: "white",
                              backgroundColor:
                                data.status === "Accepted"
                                  ? theme.palette.success.main
                                  : data.status === "Rejected"
                                    ? theme.palette.error.main
                                    : theme.palette.warning.main,
                            }}
                          >
                            {data.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {data.remarks && data.remarks.length > 20 ? (
                            <Button
                              size="small"
                              onClick={() =>
                                handleClickViewRemarks(data.remarks)
                              }
                            >
                              View
                            </Button>
                          ) : (
                            data.remarks || "N/A"
                          )}
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
              count={withdrawRows.length}
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

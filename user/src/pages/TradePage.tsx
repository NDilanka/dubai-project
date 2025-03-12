import { Box, Button, Stack, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import postTradeService from "../services/tradeService";
import { UserContext } from "../../../auth/src/context/UserContext";

export default function TradePage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tradeData, setTradeData] = useState({
    btc1: "0",
    btc2: "0",
    btc3: "0",
    btc4: "0",
    btc5: "0",
    tradeAmount: "0",
  });
  const userContext = useContext(UserContext);

  useEffect(() => {
    const appendScript = (
      containerSelector: string,
      src: string,
      config: object,
    ) => {
      const container = document.querySelector(containerSelector);
      if (container) {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.innerHTML = JSON.stringify(config);
        container.appendChild(script);
      }
    };

    appendScript(
      ".chart",
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
      {
        width: "100%",
        height: "100%",
        symbols: [
          { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
          { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
          { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
          { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
          { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        ],
        symbol: "BTC",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        allow_symbol_change: true,
        calendar: false,
        support_host: "https://www.tradingview.com",
      },
    );

    return () => {
      document.querySelectorAll(".chart").forEach((container) => {
        container.innerHTML = "";
      });
    };
  }, [rowsPerPage, page]);

  const handleClickSell = async () => {
    if (userContext?.user) {
      const result = await postTradeService({
        userId: userContext.user._id,
        amount: parseInt(tradeData.tradeAmount),
        btc1: parseInt(tradeData.btc1),
        btc2: parseInt(tradeData.btc2),
        btc3: parseInt(tradeData.btc3),
        btc4: parseInt(tradeData.btc4),
        btc5: parseInt(tradeData.btc5),
        action: "sell",
      });

      if (result.success) {
        alert("Success!");
        setTradeData({
          btc1: "0",
          btc2: "0",
          btc3: "0",
          btc4: "0",
          btc5: "0",
          tradeAmount: "0",
        });
      }
    } else {
      console.error("User not logged in!");
    }
  };

  const handleClickBuy = async () => {
    if (userContext?.user) {
      const result = await postTradeService({
        userId: userContext.user._id,
        amount: parseInt(tradeData.tradeAmount),
        btc1: parseInt(tradeData.btc1),
        btc2: parseInt(tradeData.btc2),
        btc3: parseInt(tradeData.btc3),
        btc4: parseInt(tradeData.btc4),
        btc5: parseInt(tradeData.btc5),
        action: "buy",
      });

      if (result.success) {
        alert("Success!");
        setTradeData({
          btc1: "0",
          btc2: "0",
          btc3: "0",
          btc4: "0",
          btc5: "0",
          tradeAmount: "0",
        });
      }
    } else {
      console.error("User not logged in!");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 0 } }}>
      <Stack direction={{ xs: "column", md: "row" }} gap={{ xs: 4, md: 8 }}>
        <Box
          className="chart"
          borderRadius={2}
          overflow="hidden"
          border={1}
          borderColor="#434651"
          sx={{
            width: { xs: "100%", md: 1000 },
            height: { xs: 300, md: 600 },
          }}
        />

        <Stack gap={3} sx={{ width: { xs: "100%", md: "auto" } }}>
          <Stack justifyContent="space-between" gap={2} sx={{ flex: 1 }}>
            {["btc1", "btc2", "btc3", "btc4", "btc5"].map((field) => (
              <TextField
                key={field}
                variant="outlined"
                label={field.toUpperCase()}
                value={tradeData[field as keyof typeof tradeData]}
                onChange={(e) =>
                  setTradeData({ ...tradeData, [field]: e.target.value })
                }
                fullWidth
              />
            ))}

            <TextField
              variant="outlined"
              label="Trade Amount"
              value={tradeData.tradeAmount}
              onChange={(e) =>
                setTradeData({ ...tradeData, tradeAmount: e.target.value })
              }
              fullWidth
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} gap={{ xs: 2, md: 3 }}>
            <Button
              variant="contained"
              color="error"
              size="large"
              fullWidth
              onClick={handleClickSell}
            >
              Sell
            </Button>

            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              onClick={handleClickBuy}
            >
              Buy
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

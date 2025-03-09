import { Box, useTheme } from "@mui/material";
import { useEffect } from "react";
import Header from "../components/Header/Header";

export default function HomePage() {
  const theme = useTheme();

  useEffect(() => {
    const appendScript = (
      containerSelector: string,
      src: string,
      config: object
    ) => {
      const container = document.querySelector(containerSelector);
      if (container) {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.innerHTML = JSON.stringify({
          ...config,
          width: "100%",
          height: "100%",
        });
        container.appendChild(script);
      }
    };

    appendScript(
      ".tradingview-widget-container__widget",
      "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js",
      {
        currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD"],
        isTransparent: false,
        colorTheme: "dark",
        locale: "en",
        backgroundColor: "rgba(0, 0, 0, 1)",
      }
    );

    const miniWidgetsConfig = [
      {
        selector: ".mini-widget-1",
        config: {
          symbol: "FX:EURUSD",
          locale: "en",
          dateRange: "12M",
          colorTheme: "dark",
          backgroundColor: "rgba(0, 0, 0, 1)",
          isTransparent: true,
          autosize: true,
        },
      },
      {
        selector: ".mini-widget-2",
        config: {
          symbol: "MARKETSCOM:OIL",
          locale: "en",
          dateRange: "12M",
          colorTheme: "dark",
          backgroundColor: "rgba(0, 0, 0, 1)",
          isTransparent: true,
          autosize: true,
        },
      },
      {
        selector: ".mini-widget-3",
        config: {
          symbol: "OANDA:AUDCAD",
          locale: "en",
          dateRange: "12M",
          colorTheme: "dark",
          backgroundColor: "rgba(0, 0, 0, 1)",
          isTransparent: true,
          autosize: true,
        },
      },
    ];

    miniWidgetsConfig.forEach(({ selector, config }) =>
      appendScript(
        selector,
        "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js",
        config
      )
    );

    appendScript(
      ".heatmap-widget",
      "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js",
      {
        currencies: [
          "EUR",
          "USD",
          "JPY",
          "GBP",
          "CHF",
          "AUD",
          "CAD",
          "NZD",
          "CNY",
        ],
        isTransparent: false,
        colorTheme: "dark",
        locale: "en",
        backgroundColor: "rgba(0, 0, 0, 1)",
      }
    );

    appendScript(
      ".timeline-widget",
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js",
      {
        feedMode: "all_symbols",
        isTransparent: false,
        displayMode: "regular",
        colorTheme: "dark",
        locale: "en",
      }
    );

    appendScript(
      ".ticker-tape-widget",
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js",
      {
        symbols: [
          { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
          { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
          { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
          { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
          { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        ],
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: "adaptive",
        colorTheme: "dark",
        backgroundColor: "rgba(0, 0, 0, 1)",
        locale: "en",
      }
    );

    return () => {
      document
        .querySelectorAll(
          ".tradingview-widget-container__widget, .mini-widget-1, .mini-widget-2, .mini-widget-3, .heatmap-widget, .timeline-widget, .ticker-tape-widget"
        )
        .forEach((container) => {
          container.innerHTML = "";
        });
    };
  }, []);

  return (
    <Box>
      <Header />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: { xs: 2, md: 10 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "100%" }, height: { xs: 400, md: 452 } }}>
          <Box
            className="tradingview-widget-container"
            style={{ width: "100%", height: "100%" }}
          >
            <Box className="tradingview-widget-container__widget"  style={{ width: "100%", height: "100%" }} ></Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: { xs: "90%", md: "60%" },
          mx: "auto",
          textAlign: "center",
          mt: { xs: 4, md: 6 },
        }}
      >
        <Box
          component="h2"
          sx={{
            fontSize: { xs: 28, sm: 36, md: 46 },
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          Check your favorite coin price within a glance
        </Box>
        <Box
          component="p"
          sx={{ color: "#A6AAB2", fontSize: { xs: 14, md: 16 } }}
        >
          Step into the world of trading excellence and seize every opportunity
          with our advanced platform, expert guidance, and strategic insights
          for unrivaled financial success.
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          gap: { xs: 2, md: 4 },
          mt: { xs: 4, md: 8 },
          px: { xs: 2, md: 0 },
        }}
      >
        {[1, 2, 3].map((num) => (
          <Box
            key={num}
            sx={{
              width: { xs: "100%", md: 350 },
              height: { xs: 220, md: 240 },
              borderRadius: 2,
              overflow: "hidden",
              border: 1,
              borderColor: "#434651",
            }}
          >
            <Box
              className={`mini-widget-${num}`}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          maxWidth: { xs: "90%", md: "60%" },
          mx: "auto",
          textAlign: "center",
          mt: { xs: 4, md: 8 },
        }}
      >
        <Box
          component="h2"
          sx={{
            fontSize: { xs: 28, sm: 36, md: 46 },
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          Check real-time heat map, find opportunities, and trade with
          confidence
        </Box>
        <Box
          component="p"
          sx={{ color: "#A6AAB2", fontSize: { xs: 14, md: 16 } }}
        >
          Step into the world of trading excellence and seize every opportunity
          with our advanced platform, expert guidance, and strategic insights
          for unrivaled financial success.
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: "space-between" },
          mt: { xs: 4, md: 8 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "60%" }, height: { xs: 400, md: 452 } }}>
          <Box className="heatmap-widget" style={{ width: "100%", height: "100%" }} />
        </Box>
        <Box sx={{ width: { xs: "100%", md: 330 }, height: { xs: 400, md: 452 } }}>
          <Box className="timeline-widget" style={{ width: "100%", height: "100%" }} />
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 4, md: 8 }, height: 46, px: { xs: 2, md: 0 } }}>
        <Box className="ticker-tape-widget" style={{ width: "100%", height: "100%" }} />
      </Box>
    </Box>
  );
}
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
        script.innerHTML = JSON.stringify(config);
        container.appendChild(script);
      }
    };

    appendScript(
      ".tradingview-widget-container__widget",
      "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js",
      {
        width: 1000,
        height: 400,
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
          width: 350,
          height: 220,
          locale: "en",
          dateRange: "12M",
          colorTheme: "dark",
          backgroundColor: "rgba(0, 0, 0, 1)",
          isTransparent: true,
          autosize: false,
          largeChartUrl: "",
        },
      },
      {
        selector: ".mini-widget-2",
        config: {
          symbol: "MARKETSCOM:OIL",
          width: 350,
          height: 220,
          locale: "en",
          dateRange: "12M",
          colorTheme: "dark",
          backgroundColor: "rgba(0, 0, 0, 1)",
          isTransparent: true,
          autosize: false,
          largeChartUrl: "",
        },
      },
      {
        selector: ".mini-widget-3",
        config: {
          symbol: "OANDA:AUDCAD",
          width: 350,
          height: 220,
          locale: "en",
          dateRange: "12M",
          colorTheme: "dark",
          backgroundColor: "rgba(0, 0, 0, 1)",
          isTransparent: true,
          autosize: false,
          largeChartUrl: "",
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
        width: 767,
        height: 452,
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
        width: 330,
        height: 452,
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
        display="flex"
        justifyContent="center"
        marginTop={10}
        sx={{
          [theme.breakpoints.down("sm")]: {
            marginTop: 2,
          },
          [theme.breakpoints.down("md")]: {
            marginTop: 5
          }
        }}
      >
        <Box
          borderRadius={5}
          overflow="hidden"
          border={2}
          borderColor="#434651"
        >
          <div className="tradingview-widget-container">
            <div className="tradingview-widget-container__widget"></div>
          </div>
        </Box>
      </Box>

      <Box
        maxWidth="60%"
        mx="auto"
        textAlign="center"
        marginTop={5}
        sx={{
          [theme.breakpoints.down("sm")]: {
            maxWidth: "80%",
          },
        }}
      >
        <Box
          component="h2"
          fontSize={46}
          sx={{
            [theme.breakpoints.down("sm")]: {
              fontSize: 28,
              lineHeight: 1.2,
            },
            [theme.breakpoints.down("md")]: {
              fontSize: 42,
              lineHeight: 1.2
            }
          }}
        >
          Check your favorite coin price within a glance
        </Box>
        <Box
          component="p"
          color="#A6AAB2"
          sx={{
            [theme.breakpoints.down("sm")]: {
              fontSize: 14,
            },
          }}
        >
          Step into the world of trading excellence and seize every opportunity
          with our advanced platform, expert guidance, and strategic insights
          for unrivaled financial success.
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent="space-around"
        marginTop={10}
        flexWrap="wrap"
        sx={{
          [theme.breakpoints.down("sm")]: {
            marginTop: 0,
          },
        }}
      >
        <Box
          className="mini-widget-1"
          borderRadius={2}
          overflow="hidden"
          border={1}
          borderColor="#434651"
        />
        <Box
          className="mini-widget-2"
          borderRadius={2}
          overflow="hidden"
          border={1}
          borderColor="#434651"
        />
        <Box
          className="mini-widget-3"
          borderRadius={2}
          overflow="hidden"
          border={1}
          borderColor="#434651"
        />
      </Box>

      <Box
        maxWidth="60%"
        mx="auto"
        textAlign="center"
        marginTop={6}
        sx={{
          [theme.breakpoints.down("sm")]: {
            marginTop: 0,
            maxWidth: "80%",
          },
        }}
      >
        <Box
          component="h2"
          fontSize={46}
          sx={{
            [theme.breakpoints.down("sm")]: {
              fontSize: 28,
              lineHeight: 1.2,
            },
            [theme.breakpoints.down("md")]: {
              fontSize: 42,
              lineHeight: 1.2
            }
          }}
        >
          Check real-time heat map, find opportunities, and trade with
          confidence
        </Box>
        <Box
          component="p"
          color="#A6AAB2"
          sx={{
            [theme.breakpoints.down("sm")]: {
              fontSize: 14,
            },
          }}
        >
          Step into the world of trading excellence and seize every opportunity
          with our advanced platform, expert guidance, and strategic insights
          for unrivaled financial success.
        </Box>
      </Box>

      <Box display="flex" gap={5} marginTop={10}>
        <Box className="heatmap-widget" />
        <Box className="timeline-widget" />
      </Box>

      <Box className="ticker-tape-widget" marginY={10} height={10} />
    </Box>
  );
}

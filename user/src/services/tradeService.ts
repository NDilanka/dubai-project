export default async function postTradeService(trade: {
  userId: string;
  amount: number;
  btc1: number;
  btc2: number;
  btc3: number;
  btc4: number;
  btc5: number;
  action: "sell" | "buy";
}) {
  try {
    const response = await fetch("/api/trades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trade),
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    }

    return {
      success: false,
      message: data.message || "Something went wrong!",
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong!",
    };
  }
}

import { Db, ObjectId } from "mongodb";

const secretKey = "SECRET KEY";

export default async function tradeController(request: Request, db: Db) {
  try {
    if (request.method === "GET") {
      const trades = await db.collection("trades").find();
      console.log("============");
      console.log(trades);
      console.log("============");

      return new Response(JSON.stringify({message: "GET trade"}), {
        status: 200,
        headers: {"Content-Type": "application/json"}
      });
    } else if (request.method === "POST") {
      const data = await request.json();

      // TODO: Check if these verifications are correct.
      if (!data.userId) {
        return new Response(JSON.stringify({message: "User id not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (!data.amount) {
        return new Response(JSON.stringify({message: "User id not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (!data.btc1) {

        return new Response(JSON.stringify({message: "BTC1 not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (!data.btc2) {
        return new Response(JSON.stringify({message: "BTC2 not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (!data.btc3) {
        return new Response(JSON.stringify({message: "BTC3 not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (!data.btc4) {
        return new Response(JSON.stringify({message: "BTC4 not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (!data.btc5) {
        return new Response(JSON.stringify({message: "BTC5 not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      const timestamp = new Date().toUTCString();

      const savedTrade = await db.collection("trades").insertOne({
        userId: new ObjectId(data.userId),
        amount: data.amount,
        btc1: data.btc1,
        btc2: data.btc2,
        btc3: data.btc3,
        btc4: data.btc4,
        btc5: data.btc5,
        createdAt: timestamp,
        updatedAt: timestamp
      });

      if (!savedTrade) {
        return new Response(JSON.stringify({message: "Failed to save the trade!"}), {
          status: 500,
          headers: {"Content-Type": "application/json"}
        });
      }

      return new Response(JSON.stringify({message: "Traded saved succussfully!"}), {
        status: 201,
        headers: {"Content-Type": "application/json"}
      });
    } else {
      return new Response(JSON.stringify({message: "Method not allowed!"}), {
        status: 405,
        headers: {"Content-Type": "application/json"}
      });
    }
  } catch (error: any) {
    console.error(error);

    return new Response(JSON.stringify({message: "Something went wrong!"}), {
      status: 500,
      headers: {"Content-Type": "application/json"}
    });
  }
}

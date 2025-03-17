import { Db, ObjectId } from "mongodb";

const secretKey = process.env.SECRET_KEY;

export default async function tradeController(request: Request, db: Db) {
  const splitedUrl = request.url.split("/");

  try {
    if (request.method === "GET") {
      if (splitedUrl.length === 5) {
        const trades = await db
          .collection("trades")
          .aggregate([
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
            {
              $project: {
                userId: 0,
                user: {
                  password: 0,
                },
              },
            },
          ])
          .toArray();

        return new Response(JSON.stringify(trades), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else if (splitedUrl.length === 6) {
        const userId = splitedUrl[5];
        const userTrades = await db
          .collection("trades")
          .aggregate([
            {
              $match: {
                userId: new ObjectId(`${userId}`),
                isAccepted: true,
              },
            },
          ])
          .toArray();

        return new Response(JSON.stringify(userTrades), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else if (request.method === "POST") {
      const data = await request.json();

      // TODO: Check if these verifications are correct.
      if (!data.userId) {
        return new Response(
          JSON.stringify({ message: "User id not provided!" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (!data.amount) {
        return new Response(
          JSON.stringify({ message: "User id not provided!" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const timestamp = new Date().toUTCString();

      const savedTrade = await db.collection("trades").insertOne({
        userId: new ObjectId(`${data.userId}`),
        amount: data.amount,
        btc1: data.btc1,
        btc2: data.btc2,
        btc3: data.btc3,
        btc4: data.btc4,
        btc5: data.btc5,
        isAccepted: false,
        remarks: "",
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      if (!savedTrade) {
        return new Response(
          JSON.stringify({ message: "Failed to save the trade!" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({ message: "Traded saved succussfully!" }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        },
      );
    } else if (request.method === "PUT") {
      try {
        const data = await request.json();

        if (data.btc1.length === 0) {
          return new Response(
            JSON.stringify({ message: "Please provide btc1!" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        if (data.btc2.length === 0) {
          return new Response(
            JSON.stringify({ message: "Please provide btc2!" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        if (data.btc3.length === 0) {
          return new Response(
            JSON.stringify({ message: "Please provide btc3!" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        if (data.btc4.length === 0) {
          return new Response(
            JSON.stringify({ message: "Please provide btc4!" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        if (data.btc5.length === 0) {
          return new Response(
            JSON.stringify({ message: "Please provide btc5!" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        if (!data.amount) {
          return new Response(
            JSON.stringify({ message: "Please provide the amount" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        if (!data.remarks) {
          return new Response(JSON.stringify({message: "Please provide the remarks"}), {
            status: 400,
            headers: {"Content-Type": "application/json"}
          });
        }

        const result = await db.collection("trades").updateOne(
          { _id: new ObjectId(`${data.id}`) },
          {
            $set: {
              btc1: data.btc1,
              btc2: data.btc2,
              btc3: data.btc3,
              btc4: data.btc4,
              btc5: data.btc5,
              amount: data.amount,
              remarks: data.remarks,
              updatedAt: new Date().toUTCString(),
              isAccepted: data.isAccepted
            },
          },
        );

        if (result.modifiedCount === 1) {
          return new Response(
            JSON.stringify({ message: "Trade updated successfully!" }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        return new Response(
          JSON.stringify({ message: "Trade updated successfully!" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (error: any) {
        console.error(error);

        return new Response(
          JSON.stringify({ message: "Something went wrong!" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } else {
      return new Response(JSON.stringify({ message: "Method not allowed!" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error(error);

    return new Response(JSON.stringify({ message: "Something went wrong!" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

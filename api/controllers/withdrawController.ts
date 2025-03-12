import { Db, ObjectId } from "mongodb";

const secretKey = "SECRET KEY";

export default async function withdrawController(request: Request, db: Db) {
  const splitedUrl = request.url.split("/");

  try {
    if (request.method === "GET") {
      if (splitedUrl.length === 5) {
        const withdraws = await db.collection("withdraws").aggregate([
          { 
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $unwind: "$user"
          },
          {
            $project: {
              _id: 1,
              amount: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
              user: {
                _id: 1,
                autoFXId: 1,
                email: 1
              },
            }
          }
        ]).toArray();

        return new Response(JSON.stringify(withdraws), {
          status: 200,
          headers: {"Content-Type": "application/json"}
        });
      } else if (splitedUrl.length === 6) {
        const userId = splitedUrl[5];
        const withdraws = await db.collection("withdraws")
                                  .find({userId: new ObjectId(userId)})
                                  .toArray();

        return new Response(JSON.stringify(withdraws), {
          status: 200,
          headers: {"Content-Type": "application/json"}
        });
      } else {
        return new Response(JSON.stringify({message: "Invalid URL!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }
    } else if (request.method === "POST") {
      console.log("POST");
      const data = await request.json();

      // Save the record in the database.
      const savedWithdraw = await db.collection("withdraws").insertOne({
        userId: new ObjectId(`${data.userId}`),
        amount: data.amount,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      if (!savedWithdraw) {
        return new Response(JSON.stringify({message: "Failed to make the withdraw!"}), {
          status: 500,
          headers: {"Content-Type": "application/json"}
        });
      }

      return new Response(JSON.stringify({message: "Withdraw requests successful!"}), {
        status: 201,
        headers: {"Content-Type": "application/json"}
      });
    } else if (request.method === "PATCH") {
      const data = await request.json();

      // TODO: Validate data (input from the client).

      // Update the deposit status.
      const result = await db.collection("withdraws").updateOne({ _id : new ObjectId(data.id) }, {
        $set: {
          status: data.status,
          updatedAt: new Date()
        }
      });

      if (result.modifiedCount === 1) {
        return new Response(JSON.stringify({message: "Deposit status change successful!"}), {
          status: 200,
          headers: {"Content-Type": "application/json"}
        });
      }

      return new Response(JSON.stringify({message: "Failed to change the deposit status!"}), {
        status: 500,
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

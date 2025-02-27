import { Db, ObjectId } from "mongodb";

const secretKey = "SECRET KEY";

export default async function walletController(request: Request, db: Db) {
  try { 
    if (request.method === "GET") {
      const url = new URL(request.url);
      const userId = url.searchParams.get("userId");

      if (userId) {
        const user = await db.collection("users").aggregate([
          {
            $match: {
              _id: new ObjectId(userId)
            }
          },
          {
            $limit: 1
          },
          {
            $project: {
              currency: 1,
              balance: 1
            }
          }
        ]).toArray();

        if (user.length > 0) {
          return new Response(JSON.stringify(user[0]), {
            status: 200,
            headers: {"Content-Type": "application/json"}
          });
        } else {
          return new Response(JSON.stringify({message: "User not found!"}), {
            status: 404,
            headers: {"Content-Type": "application/json"}
          });
        }
      }

      const users = await db.collection("users").aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role"
          }
        },
        {
          $unwind: "$role"
        },
        {
          $match: {
            "role.name": "User"
          }
        },
        {
          $project: {
            _id: 1,
            email: 1,
            currency: 1,
            balance: 1
          }
        }
      ]).toArray();

      return new Response(JSON.stringify(users), {
        status: 200,
        headers: {"Content-Type": "application/json"}
      });
    } else if (request.method === "PATCH") {
      const data = await request.json();

      if (data.id.length === 0) {
        return new Response(JSON.stringify({message: "User id is not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (data.balance < 0) {
        return new Response(JSON.stringify({message: "Please enter a valid amount!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      const result = await db.collection("users").updateOne( { _id: new ObjectId(`${data.id}`) }, { 
        $set: {
          balance: data.balance 
        }
      });

      if (result.modifiedCount === 1) {
        return new Response(JSON.stringify({message: "Balance updated successfully!"}), {
          status: 200,
          headers: {"Content-Type": "application/json"}
        });
      }

      return new Response(JSON.stringify({message: "Failed to update the balance!"}), {
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

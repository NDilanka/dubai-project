import { Db } from "mongodb";

const secretKey = "SECRET KEY";

export default async function userController(request: Request, db: Db) {
  try {
    if (request.method === "GET") {
      // Extract role name from query paramters.
      const url = new URL(request.url);
      const role = url.searchParams.get("role");

      // Find all the users with privided role.
      //const users = await db.collection("users").find({}).toArray();
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
          $project: {
            password: 0
          }
        },
        {
          $unwind: "$role"
        },
        {
          $match: {
            "role.name": role
          }
        }
      ]).toArray();

      return new Response(JSON.stringify(users), {
        status: 200,
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

    return new Response(JSON.stringify({message: "Somethong went wrong!"}), {
      status: 500,
      headers: {"Content-Type": "application/json"}
    });
  }
}

import { Db, ObjectId } from "mongodb";

const secretKey = "SECRET KEY!";

export default async function userRoleController(request: Request, db: Db) {
  try {
    if (request.method === "POST") {
      const data = await request.json();

      if (data.userId.length === 0) {
        return new Response(JSON.stringify({message: "User id is not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      const foundUserUserRole = await db.collection("users").aggregate([
        {
          $match: {
            _id: new ObjectId(`${data.userId}`)
          }
        },
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role"
          }
        },
        {
          $limit: 1
        },
        {
          $unwind: "$role"
        },
        {
          $project: {
            _id: 0,
            role: 1
          }
        }
      ]).toArray();

      if (!foundUserUserRole || foundUserUserRole.length === 0) {
        return new Response(JSON.stringify({message: "User not found!"}), {
          status: 404,
          headers: {"Content-Type": "application/json"}
        });
      }

      return new Response(JSON.stringify(foundUserUserRole[0].role), {
        status: 200,
        headers: {"Content-Type": "application/json"}
      });
    } else {
      return new Response(JSON.stringify({message: "Method not allowed!"}), {
        status: 500,
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

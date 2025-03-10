import { Db, ObjectId } from "mongodb";

const secretKey = "SECRET KEY!";

export default async function suuperAdminController(request: Request, db: Db) {
  try {
    const superAdmin = await db.collection("users").aggregate([
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
          "role.name": "Super Admin"
        }
      },
      {
        $project: {
          password: 0,
          roleId: 0
        }
      }
    ]).toArray();

    return new Response(JSON.stringify(superAdmin), {
      status: 200,
      headers: {"Content-Type": "application/json"}
    });
  } catch (error: any) {
    console.error(error);

    return new Response(JSON.stringify({message: "Something went wrong!"}), {
      status: 500,
      headers: {"Content-Type": "application/json"}
    });
  }
}

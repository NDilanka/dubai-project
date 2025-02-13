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
    } else if (request.method === "POST") {
      const data = await request.json();

      if (data.firstName.length === 0) {
        return new Response(JSON.stringify({message: "Please enter your first name!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (data.lastName.length === 0) {
        return new Response(JSON.stringify({message: "Please enter your last name!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (data.email.length === 0) {
        return new Response(JSON.stringify({message: "Please enter an email!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (data.phoneNumber.length === 0) {
        return new Response(JSON.stringify({message: "Please enter a phone number!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (data.password.length === 0) {
        return new Response(JSON.stringify({message: "Please enter a password!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      // Check if the user is already exists.
      const foundUser = await db.collection("users").findOne({email: data.email});

      if (foundUser) {
        return new Response(JSON.stringify({message: "User already exists!"}), {
          status: 409,
          headers: {"Content-Type": "application/json"}
        });
      }

      // Hash the password.
      const hashedPassword = await Bun.password.hash(data.password, {
        algorithm: "bcrypt",
        cost: 10
      });

      const url = new URL(request.url);
      const requestedRole = url.searchParams.get("role");

      if (requestedRole === "Admin") {
        const adminRole = await db.collection("roles").findOne({name: "Admin"});

        if (!adminRole) {
          console.error("Admin role not found!");

          return new Response(JSON.stringify({message: "Failed to create new admin!"}), {
            status: 500,
            headers: {"Content-Type": "application/json"}
          });
        }

        const savedAdmin = await db.collection("users").insertOne({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: hashedPassword,
          roleId: adminRole._id,
          date: new Date()
        });

        if (!savedAdmin) {
          return new Response(JSON.stringify({message: "Failed to create the admin"}), {
            status: 500,
            headers: {"Content-Type": "application/json"}
          });
        }
      } else {
        // TODO: Add the same for creating a new user as well.
      }

      return new Response(JSON.stringify({message: "Admin created successfully!"}), {
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

    return new Response(JSON.stringify({message: "Somethong went wrong!"}), {
      status: 500,
      headers: {"Content-Type": "application/json"}
    });
  }
}

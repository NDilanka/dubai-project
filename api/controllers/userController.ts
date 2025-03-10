import jwt from "jsonwebtoken";
import { Db, ObjectId } from "mongodb";

const secretKey = "SECRET KEY";

export default async function userController(request: Request, db: Db) {
  const splitedUrl = request.url.split("/");

  try {
    if (request.method === "GET") {
      if (splitedUrl.length === 5) {
        // Extract role name from query paramters.
        const url = new URL(request.url);
        const role = url.searchParams.get("role");

        // Find all the users with privided role.
        if (role === "User") {
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
        } else if (role === "Admin") {
          const admins = await db.collection("users").aggregate([
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
                $or: [
                  {"role.name": "Admin"},
                  {"role.name": "Super Admin"}
                ]
              }
            }
          ]).toArray();

          return new Response(JSON.stringify(admins), {
            status: 200,
            headers: {"Content-Type": "application/json"}
          });
        }
      } else if (splitedUrl.length === 6) {
        const userId = splitedUrl[5];
        const foundUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });

        if (!foundUser) {
          return new Response(JSON.stringify({message: "User not found!"}), {
            status: 404,
            headers: {"Content-Type": "application/json"}
          });
        }

        return new Response(JSON.stringify(foundUser), {
          status: 200,
          headers: {"Content-Type": "application/json"}
        });
      } else {
        return new Response(JSON.stringify({message: "Url not valid!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }
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

        const autoFXIds = await db.collection("tracking_data").aggregate([
                            {
                              $sort: {
                                idCounter: -1
                              }
                            },
                            {
                              $limit: 1
                            }
                          ]).toArray();

        const result = await db.collection("tracking_data").updateOne({ _id: autoFXIds[0]._id }, {
          $set: {
            idCounter: autoFXIds[0].idCounter + 1
          }
        });

        if (result.modifiedCount !== 1) {
          // Id is not incremented.
          return new Response(JSON.stringify({message: "Failed to create a new admin!"}), {
            status: 500,
            headers: {"Content-Type": "application/json"}
          });
        }

        const savedAdmin = await db.collection("users").insertOne({
          autoFXId: autoFXIds[0].idCounter + 1,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          currencty: "USD",
          balance: 0,
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
    } else if (request.method === "PUT") {
      const data = await request.json();

      if (data.id.length === 0) {
        return new Response(JSON.stringify({message: "User id must be provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (data.firstName.length === 0) {
        return new Response(JSON.stringify({message: "Please enter the first name!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (data.lastName.length === 0) {
        return new Response(JSON.stringify({message: "Please enter the last name!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (data.email.length === 0) {
        return new Response(JSON.stringify({message: "Please enter the email!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (data.phoneNumber.length === 0) {
        return new Response(JSON.stringify({message: "Please enter the phone number!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      // Update the user data.
      const result = await db.collection("users").updateOne({ _id: new ObjectId(`${data.id}`) }, {
        $set: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          currency: data.currency
        }
      });

      if (result.modifiedCount === 1) {
        return new Response(JSON.stringify({message: "Admin data updated successfully!"}), {
          status: 200,
          headers: {"Content-Type": "application/json"}
        });
      }

      return new Response(JSON.stringify({message: "Failed to update admin data!"}), {
        status: 500,
        headers: {"Content-Type": "application/json"}
      });
    } else if (request.method === "PATCH") {
      const data = await request.json();

      if (splitedUrl.length === 5) {
        if (data.id.length === 0) {
          return new Response(JSON.stringify({message: "User id must be provided!"}), {
            status: 400,
            headers: {"Content-Type": "application/json"}
          });
        }

        if (data.newState.length === 0) {
          return new Response(JSON.stringify({message: "Please enter the phone number!"}), {
            status: 400,
            headers: {"Content-Type": "application/json"}
          });
        }

        // Update the user state.
        const result = await db.collection("users").updateOne({ _id: new ObjectId(`${data.id}`) }, {
          $set: {
            active: data.newState
          }
        });

        if (result.modifiedCount === 1) {
          return new Response(JSON.stringify({message: "Admin state updated successfully!"}), {
            status: 200,
            headers: {"Content-Type": "application/json"}
          });
        }

        return new Response(JSON.stringify({message: "Failed to update admin state!"}), {
          status: 500,
          headers: {"Content-Type": "application/json"}
        });
      } else if (splitedUrl.length === 6) {
        const userId = splitedUrl[5];

        // TODO: Check if firstName, lasstName, email and phoneNumber exists in the request.

        const result = await db.collection("users").updateOne({ _id: new ObjectId(`${userId}`) }, {
          $set: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber
          }
        });

        if (result.modifiedCount === 1) {
          const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

          if (!user) {
            return new Response(JSON.stringify({message: "User not found!"}), {
              status: 404,
              headers: {"Content-Type": "application/json"}
            });
          }

          const payload = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNo,
            currency: user.currency
          };

          const token = jwt.sign(payload, secretKey, {expiresIn: "1h"});
          console.log(token);

          return new Response(JSON.stringify({message: "Sign in successful!"}), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              // TODO: Add 'Secure;' when using https `autoFXToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`.
              "Set-Cookie": `autoFXToken=${token}; Path=/; HttpOnly; SameSite=Strict`
            }
          });
        } else {
          return new Response(JSON.stringify({message: "Failed to update user details!"}), {
            status: 400,
            headers: {"Content-Type": "application/json"}
          });
        }
      }
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


export async function saveUserChanges(request: Request, db: Db) {
  if (request.method !== "PUT") {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const data = await request.json();

    if (!data.id || data.id.length === 0) {
      return new Response(JSON.stringify({ message: "User id must be provided!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!data.firstName || data.firstName.length === 0) {
      return new Response(JSON.stringify({ message: "Please enter the first name!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!data.lastName || data.lastName.length === 0) {
      return new Response(JSON.stringify({ message: "Please enter the last name!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!data.email || data.email.length === 0) {
      return new Response(JSON.stringify({ message: "Please enter the email!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!data.phoneNumber || data.phoneNumber.length === 0) {
      return new Response(JSON.stringify({ message: "Please enter the phone number!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Update the user data.
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(data.id) },
      {
        $set: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          currency: data.currency,
          date: data.date || new Date().toISOString()
        }
      }
    );

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ message: "User updated successfully!", updatedUser: data }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ message: "Failed to update user data!" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Something went wrong!", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

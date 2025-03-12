import { Db, ObjectId } from "mongodb";

const secretKey = "SECRET KEY";

export default async function depositController(request: Request, db: Db) {
  const splitedUrl = request.url.split("/");

  try {
    if (request.method === "GET") {
      if (splitedUrl.length === 5) {
        const deposits = await db.collection("deposits").aggregate([
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
              filePath: 1,
              amount: 1,
              createdAt: 1,
              updatedAt: 1,
              status: 1,
              user: {
                _id: 1,
                autoFXId: 1,
                email: 1
              }
            }
          }
        ]).toArray();

        return new Response(JSON.stringify(deposits), {
          status: 200,
          headers: {"Content-Type": "application/json"}
        });
      } else if (splitedUrl.length === 6) {
        const userId = splitedUrl[5];
        const deposits = await db.collection("deposits")
                                  .find({userId: new ObjectId(userId)})
                                  .toArray();

        return new Response(JSON.stringify(deposits), {
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
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const userId = formData.get("userId") as string | null;
      const method = formData.get("method") as string | null;
      const amount = formData.get("amount") as string | null;

      if (!file) {
        return new Response(JSON.stringify({message: "Please upload the file!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (!userId) {
        return new Response(JSON.stringify({message: "User id is not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      if (!method) {
        return new Response(JSON.stringify({message: "Method is not provided!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }


      if (!amount) {
        return new Response(JSON.stringify({message: "Please enter the deposit amount!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      const fileBuffer = await file.arrayBuffer();
      const timestamp = Date.now(); // Generate timestamp
      const fileExtension = file.name.split(".").pop(); // Extract file extension
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, ""); // Remove extension from original filename
      const filePath = `./uploads/${fileNameWithoutExt}-${timestamp}.${fileExtension}`;
      
      // Save the file
      await Bun.write(filePath, new Uint8Array(fileBuffer));

      // Save the record in the database.
      const savedDeposite = await db.collection("deposits").insertOne({
        userId: new ObjectId(`${userId}`),
        method,
        amount: parseFloat(amount),
        filePath,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      if (!savedDeposite) {
        return new Response(JSON.stringify({message: "Failed to make the deposit!"}), {
          status: 500,
          headers: {"Content-Type": "application/json"}
        });
      }

      return new Response(JSON.stringify({message: "Deposit request successful!"}), {
        status: 201,
        headers: {"Content-Type": "application/json"}
      });
    } else if (request.method === "PATCH") {
      const data = await request.json();

      // TODO: Validate data (input from the client).

      // Update the deposit status.
      const result = await db.collection("deposits").updateOne({ _id : new ObjectId(data.id) }, {
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

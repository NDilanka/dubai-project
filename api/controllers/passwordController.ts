import { Db, ObjectId } from "mongodb";

const secretKey = "SECRET KEY!";

export default async function signUpController(request: Request, db: Db) {
  try {
    const data = await request.json();

    const foundUser = await db.collection("users").findOne({_id: new ObjectId(`${data.userId}`)});

    if (!foundUser) {
      return new Response(JSON.stringify({message: "User not found!"}), {
         status: 404,
         headers: {"Content-Type": "application/json"}
       });
    }

    const passwordsMatched = await Bun.password.verify(data.oldPassword, foundUser.password);

    if (!passwordsMatched) {
      return new Response(JSON.stringify({message: "Incorrect passwords!"}), {
         status: 401,
         headers: {"Content-Type": "application/json"}
      });
    }

    const hashedNewPassword = await Bun.password.hash(data.password, {
      algorithm: "bcrypt",
      cost: 10
    });

    const result = await db.collection("users").updateOne({_id: new ObjectId(`${data.userId}`)}, {
      $set: {
        password: hashedNewPassword
      }
    });

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({message: "Passwrod change successful!"}), {
        status: 200,
        headers: {"Content-Type": "application/json"}
      });
    }

    return new Response(JSON.stringify({message: "Password change failed!"}), {
      status: 500,
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

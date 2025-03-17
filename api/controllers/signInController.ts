import jwt from "jsonwebtoken";
import { Db } from "mongodb";

const secretKey = process.env.SECRET_KEY;

export default async function signInController(request: Request, db: Db) {
  try {
    if (request.method == "POST") {
      const data = await request.json();

      // Check if the email address is provided.
      if (data.email.length === 0) {
        return new Response(JSON.stringify({message: "Please enter an email!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      // Check if the email address is in valid format.
      if (!data.email.includes("@")) {
        return new Response(JSON.stringify({message: "Please enter a valid email!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      // Check if the password is provided.
      if (data.password.length === 0) {
        return new Response(JSON.stringify({message: "Please enter the password!"}), {
          status: 400,
          headers: {"Content-Type": "application/json"}
        });
      }

      // Check if the user with provided email exists.
      const foundUser = await db.collection("users").findOne({email: data.email});

      if (!foundUser) {
        return new Response(JSON.stringify({message: "User not found!"}), {
          status: 404,
          headers: {"Content-Type": "application/json"}
        });
      }

      const passwordsMatched = await Bun.password.verify(data.password, foundUser.password);

      if (!passwordsMatched) {
        return new Response(JSON.stringify({message: "Incorrect passwords!"}), {
           status: 401,
           headers: {"Content-Type": "application/json"}
         });
       }

      const payload = {
        _id: foundUser._id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        phoneNumber: foundUser.phoneNo,
        currency: foundUser.currency
      };

      const token = jwt.sign(payload, secretKey as string, {expiresIn: "1h"});

      return new Response(JSON.stringify({message: "Sign in successful!"}), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          // TODO: Add 'Secure;' when using https `autoFXToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`.
          "Set-Cookie": `autoFXToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
        }
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

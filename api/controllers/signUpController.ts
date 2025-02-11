import jwt from "jsonwebtoken";
import { Db } from "mongodb";

const secretKey = "SECRET KEY!";

export default async function signUpController(request: Request, db: Db) {
  if (request.method == "POST") {
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
      return new Response(JSON.stringify({message: "Please enter your email address!"}), {
        status: 400,
        headers: {"Content-Type": "application/json"}
      });
    }

    if (!data.email.includes("@")) {
      return new Response(JSON.stringify({message: "Please enter a valid email address!"}), {
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

    if (data.currency.length === 0) {
      return new Response(JSON.stringify({message: "Please enter the confirm password!"}), {
        status: 400,
        headers: {"Content-Type": "application/json"}
      });
    }

    const foundUser = await db.collection("users").findOne({email: data.email});

    if (foundUser) {
      return new Response(JSON.stringify({message: "User with provided email already exists!"}), {
        status: 409,
        headers: {"Content-Type": "application/json"}
      });
    }

    // Hash the password.
    const hashedPassword = await Bun.password.hash(data.password, {
      algorithm: "bcrypt",
      cost: 10
    });

    const userRole = await db.collection("roles").findOne({name: "User"});

    if (!userRole) {
      console.error("User role not found!");

      return new Response(JSON.stringify({message: "Failed to create new user!"}), {
        status: 500,
        headers: {"Content-Type": "application/json"}
      });
    }

    const savedUser = await db.collection("users").insertOne({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNo,
      currency: data.currency,
      password: hashedPassword,
      roleId: userRole._id,
      date: new Date()
    });

    if (!savedUser) {
      return new Response(JSON.stringify({message: "Failed to create the user"}), {
        status: 500,
        headers: {"Content-Type": "application/json"}
      });
    }

    const payload = {
      _id: savedUser.insertedId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNo,
      currency: data.currency
    };

    const token = jwt.sign(payload, secretKey, {expiresIn: "1h"});

    return new Response(JSON.stringify({message: "Sign up successful!"}), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        // TODO: Add 'Secure;' when using https `ngp6Token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`.
        "Set-Cookie": `autoFXToken=${token}; Path=/; HttpOnly; SameSite=Strict`
      }
    });
  } else {
    return new Response(JSON.stringify({message: "Method not allowed!"}), {
      status: 405,
      headers: {"Content-Type": "application/json"}
    });
  }
}

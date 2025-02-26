import { Db, ObjectId } from "mongodb";

const secretKey = "SECRET KEY";

export default async function signoutController(req: Request) {
    // Allow only POST requests for signout
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    // Clear the token cookie by setting an expired cookie.
    // Adjust the cookie name ("token") if your authentication token uses a different name.
    const headers = new Headers({
      "Content-Type": "application/json",
      "Set-Cookie":
        "autoFXToken=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict"
    });
  
    // Return a response indicating that signout was successful.
    return new Response(JSON.stringify({ message: "Sign out successful" }), {
      status: 200,
      headers
    });
  }
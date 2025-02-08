import jwt from "jsonwebtoken";

const secretKey = "SECRET KEY!";

export default async function verifyTokenController(request: Request) {
  if (request.method == "POST") {
    try {
      // TODO: Test and verify this receving cookie steps are correct.
      const cookies = request.headers.get("Cookie") || "";
      const cookieObj = Object.fromEntries(
                          cookies.split(";")
                          .map((cookie) => cookie.trim().split("="))
                        );
      const token = cookieObj.autoFXToken;
      const decoded = jwt.verify(token, secretKey);

      return new Response(JSON.stringify({
        message: "Already signed in!", 
        userData: {
          _id: decoded._id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          mobileNo: decoded.phoneNumber,
          currency: decoded.currency
        }
      }), {
        headers: {"Content-Type": "application/json"}
      });
    } catch (error: any) {
      // An error occured. Log and send an error message.
      console.error(error);

      if (error.name == "JsonWebTokenError") {
        return new Response(JSON.stringify({message: "Invalid token!"}), {
          status: 401,
          headers: {"Content-Type": "application/json"}
        });
      }

      return new Response(JSON.stringify({message: "Something went wrong!"}), {
        status: 500,
        headers: {"Content-Type": "application/json"}
      });
    }
  } else {
    return new Response(JSON.stringify("Method not allowed!"), {
      status: 405,
      headers: {"Conent-Type": "application/json"}
    });
  }
}

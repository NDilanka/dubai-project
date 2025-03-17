import { Db, ObjectId } from "mongodb";

const secretKey = process.env.SECRET_KEY;

export default async function withdrawBankTransferRequestController(request: Request, db: Db) {
  try {
    if (request.method === "POST") {
      const data = await request.json();

      // TODO: Validate data.

      // Save the record in the database.
      const savedWithdraw = await db.collection("withdraws").insertOne({
        userId: new ObjectId(`${data.userId}`),
        amount: data.amount,
        username: data.username,
        bankName: data.bankName,
        accountnumber: data.accountnumber,
        IFSC: data.IFSC,
        branch: data.branch,
        upiAddress: data.upiAddress,
        method: data.method,
        status: "Pending",
        remarks: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!savedWithdraw) {
        return new Response(
          JSON.stringify({ message: "Failed to make the withdraw!" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({ message: "Withdraw requests successful!" }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        },
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Something went wrong!" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error: any) {
    console.error(error);

    return new Response(JSON.stringify({ message: "Something went wrong!" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

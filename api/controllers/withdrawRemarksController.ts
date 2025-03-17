import { Db, ObjectId } from "mongodb";

const secretKey = process.env.SECRET_KEY;

export default async function withdrawRemarksController(
  request: Request,
  db: Db,
) {
  try {
    if (request.method === "PATCH") {
      const data = await request.json();

      const result = await db.collection("withdraws").updateOne(
        { _id: new ObjectId(`${data.id}`) },
        {
          $set: {
            remarks: data.remarks,
          },
        },
      );

      if (result.modifiedCount === 1) {
        return new Response(
          JSON.stringify({ message: "Remarks successful!" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Withdraw not found!" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } else {
      return new Response(JSON.stringify({ message: "Method not allowed!" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error(error);

    return new Response(JSON.stringify({ message: "Something went wrong!" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

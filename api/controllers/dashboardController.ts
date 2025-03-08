import { Db } from "mongodb";

export default async function dashboardController(request: Request, db: Db) {
    try {
        if (request.method !== "GET") {
            return new Response(JSON.stringify({ message: "Method not allowed!" }), {
                status: 405,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Get Admin Count
        const adminCount = await db.collection("users").aggregate([
            {
                $lookup: {
                    from: "roles",
                    localField: "roleId",
                    foreignField: "_id",
                    as: "role"
                }
            },
            { $unwind: "$role" },
            { $match: { "role.name": "Admin" } },
            { $count: "count" }
        ]).toArray();

        // Get User Count
        const userCount = await db.collection("users").aggregate([
            {
                $lookup: {
                    from: "roles",
                    localField: "roleId",
                    foreignField: "_id",
                    as: "role"
                }
            },
            { $unwind: "$role" },
            { $match: { "role.name": "User" } },
            { $count: "count" }
        ]).toArray();

        // Get Total Approved Deposit Amount
        const totalDeposit = await db.collection("deposits").aggregate([
            { $match: { status: "Accepted" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]).toArray();

        // Get Pending Withdrawals
        const pendingWithdrawals = await db.collection("withdraws")
            .countDocuments({ status: "Pending" });

        // Get Pending Deposits
        const pendingDeposits = await db.collection("deposits")
            .countDocuments({ status: "Pending" });

        return new Response(JSON.stringify({
            adminCount: adminCount[0]?.count || 0,
            userCount: userCount[0]?.count || 0,
            totalDeposit: totalDeposit[0]?.total || 0,
            pendingWithdrawals,
            pendingDeposits
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
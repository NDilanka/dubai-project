import userPage from "./user/public/index.html";
import adminPage from "./admin/public/index.html";
import authPage from "./auth/public/index.html";
import signUpController from "./api/controllers/signUpController.ts";
import signInController from "./api/controllers/signInController.ts";
import verifyTokenController from "./api/controllers/verifyTokenController.ts";
import tradeController from "./api/controllers/tradeController.ts";
import { MongoClient, Db } from "mongodb";

const client: MongoClient = await MongoClient.connect("mongodb://localhost:27017");
const db: Db = client.db("dubai");

const server = Bun.serve({
  port: 8000,
  static: {
    "/sign-up": authPage,
    "/sign-in": authPage,

    "/": userPage,
    "/profile": userPage,
    "/wallet": userPage,
    "/trade": userPage,

    "/admin": adminPage,
    "/admin/admin-manager": adminPage,
    "/admin/users": adminPage,
    "/admin/change-balance": adminPage,
    "/admin/deposite-requests": adminPage,
    "/admin/withdraw-requests": adminPage,
    "/admin/trade-report": adminPage,
    "/admin/faq-messages": adminPage,
  },
  development: true,
  websocket: {
    message: () => {}
  },
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname.startsWith("/api")) {
      switch (url.pathname) {
        case "/api/sign-up": {
          return await signUpController(req, db);
        }

        case "/api/sign-in": {
          return await signInController(req, db);
        }

        case "/api/verify-token": {
          return await verifyTokenController(req);
        }

        case "/api/trades": {
          return await tradeController(req, db);
        }

        default: {
          return new Response("AutoFX API is working!");
        }
      }
    }

    const filePath = `./assets${url.pathname}`;

    try {
      const file = Bun.file(filePath);

      if (await file.exists()) {
        return new Response(file, {
          headers: {"Content-Type": "image/svg+xml"}
        });
      }

      return new Response("Not found", { status: 404 });
    } catch (error: any) {
      console.error(error);

      return new Response("Something went wrong!", { status: 500 });
    }

    return new Response("AutoFX is working!");
  }
});

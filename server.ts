import { db_uri, db_name, port } from "./consts.ts";
import userPage from "./user/public/index.html";
import adminPage from "./admin/public/index.html";
import authPage from "./auth/public/index.html";
import signUpController from "./api/controllers/signUpController.ts";
import signInController from "./api/controllers/signInController.ts";
import verifyTokenController from "./api/controllers/verifyTokenController.ts";
import tradeController from "./api/controllers/tradeController.ts";
import userController, { saveUserChanges } from "./api/controllers/userController.ts";
import { MongoClient, Db } from "mongodb";

const client: MongoClient = await MongoClient.connect(db_uri);
const db: Db = client.db(db_name);

const server = Bun.serve({
  port: port,
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

        case "/api/users/save-changes": {
          // New endpoint for saving user changes
          return await saveUserChanges(req, db);
        }

        case "/api/users": {
          return await userController(req, db);
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

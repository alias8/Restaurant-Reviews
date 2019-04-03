import dotenv from "dotenv";
import App from "./app";
import { AuthenticationController } from "./controllers/authController";
import { StoreController } from "./controllers/storeController";
import { UserController } from "./controllers/userController";
import { IEnvCustom } from "./types/interfaces";

dotenv.config({ path: "variables.env" });
console.log(`james 1 ${(process.env as IEnvCustom).DATABASE}`);

const app = new App([
  new UserController(),
  new AuthenticationController(),
  new StoreController()
]);

app.listen();

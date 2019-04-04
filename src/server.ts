import dotenv from "dotenv";
import App from "./app";
import { AuthenticationController } from "./controllers/authController";
import { StoreController } from "./controllers/storeController";
import { UserController } from "./controllers/userController";

dotenv.config({ path: "variables.env" });

const app = new App([
  new UserController(),
  new AuthenticationController(),
  new StoreController()
]);

app.listen();

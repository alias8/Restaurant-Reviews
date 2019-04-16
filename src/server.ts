import dotenv from "dotenv";
import * as path from "path";
import App, { rootDirectory } from "./app";
import { AuthenticationController } from "./controllers/authController";
import { StoreController } from "./controllers/storeController";
import { UserController } from "./controllers/userController";

dotenv.config({ path: path.join(rootDirectory, "variables.env") });

const app = new App([
    new UserController(),
    new AuthenticationController(),
    new StoreController()
]);

app.listen();

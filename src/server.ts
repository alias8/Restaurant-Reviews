import dotenv from "dotenv"
import mongoose from 'mongoose';
import App from "./app";
import { UserController } from "./controllers/userController";

dotenv.config({path : "variables.env"});

mongoose.connect(process.env.DATABASE!);
mongoose.connection.on("error", (error) => {
  console.log(error.message)
});

const app = new App([new UserController()]);

app.listen();

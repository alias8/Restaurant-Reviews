import bodyParser from "body-parser";
import express, { Router } from "express";
import path from "path";
import * as helpers from "./helpers";

export interface IController {
  // path: string;
  router: Router;
}

class App {
  public app: express.Application;

  constructor(controllers: IController[]) {
    this.app = express();
    this.app.set("port", 7778);
    console.log(`public directory is: ${path.join(__dirname, "..")}`); // from the point of view of the bundled file, not app.ts
    console.log(
      `views directory is: ${path.resolve(__dirname, "..", "..", "views")}`
    ); // from the point of view of the bundled file, not app.ts
    this.app.use(express.static(path.join(__dirname, "..")));
    this.app.set("views", path.resolve(__dirname, "..", "..", "views"));
    this.app.set("view engine", "pug");

    this.initializeControllers(controllers);
    this.setupMiddleware();
  }

  public listen() {
    this.app.listen(this.app.get("port"), () => {
      console.log(`hello world!`);
    });
  }

  private initializeControllers(controllers: IController[]) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  private setupMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use((req, res, next) => {
      res.locals.h = helpers;
      next();
    });
  }
}

export default App;

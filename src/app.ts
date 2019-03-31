import bodyParser from "body-parser";
import flash from "connect-flash";
import express, { Router } from "express";
import path from "path";
import * as helpers from "./helpers";
import "./public/sass/style.scss";

export interface IController {
  // path: string;
  router: Router;
}

export const publicDirectory = path.join(__dirname, ".."); // from the point of view of the bundled file, not app.ts
export const viewDirectory = path.resolve(__dirname, "..", "..", "views");

class App {
  public app: express.Application;

  constructor(controllers: IController[]) {
    this.app = express();

    this.app.set("port", 7778);
    this.app.use(express.static(publicDirectory));
    this.app.set("views", viewDirectory);
    this.app.set("view engine", "pug");

    this.setupMiddleware();

    this.initializeControllers(controllers);
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
    // this.app.use(flash());
    this.app.use((req: express.Request, res: express.Response, next) => {
      res.locals.h = helpers;
      // res.locals.flashes = req.flash();
      res.locals.user = (req as any).user || null;
      res.locals.currentPath = req.path;
      next();
    });
  }
}

export default App;

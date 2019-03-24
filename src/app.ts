import express, { Router } from "express";
import path from "path";

export interface IController {
  // path: string;
  router: Router;
}

class App {
  public app: express.Application;

  constructor(controllers: IController[]) {
    this.app = express();
    this.app.set('port', 7777);
    this.app.use(express.static(path.join(__dirname, "..")));
    this.app.set("views", path.resolve(__dirname, "..", "..", "views"));
    this.app.set("view engine", "pug");

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
}

export default App;

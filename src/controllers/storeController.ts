import * as express from "express";
import jimp from "jimp";
import multer, { Options } from "multer";
import uuid from "uuid";
import { IController } from "../app";
import { catchErrors } from "../handlers/errorHandlers";
import { IStore, Store } from "../models/Store";

export class StoreController implements IController {
  public static addStore = (
    request: express.Request,
    response: express.Response
  ) => {
    response.render("editStore", { title: "Add Store" });
  };
  public router = express.Router();

  private multerOptions: Options = {
    storage: multer.memoryStorage(),
    fileFilter(request: express.Request, file, next) {
      const isPhoto = file.mimetype.startsWith("image/");
      if (isPhoto) {
        next(null, true);
      } else {
        next({ message: "That file type isn't allowed", name: "" }, false);
      }
    }
  };

  private upload = multer(this.multerOptions).single("photo");

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/add",
      this.upload,
      catchErrors(this.resize),
      catchErrors(this.createStore)
    );
    this.router.post(
      "/add/:id",
      this.upload,
      catchErrors(this.resize),
      catchErrors(this.updateStore)
    );
    this.router.get("/stores/:id/edit", catchErrors(this.editStore)); // clicking on pencil icon
    this.router.get("/store/:slug", catchErrors(this.getStoreBySlug)); // clicking on individual store
    this.router.get("/tags", catchErrors(this.getStoresByTag));
    this.router.get("/tags/:tag", catchErrors(this.getStoresByTag));
    this.router.get("/api/search", catchErrors(this.searchStores));
    this.router.get("/", catchErrors(this.getStores));
    this.router.get("/stores", catchErrors(this.getStores));
  }

  private homePage = (request: express.Request, response: express.Response) => {
    response.render("index");
  };

  private resize = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    console.log(request);
    if (!request.file) {
      next();
      return;
    }
    const extension = request.file.mimetype.split("/")[1];
    request.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(request.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${request.body.photo}`);
    // once we have written photo to file system
    next();
  };

  private createStore = async (
    request: express.Request,
    response: express.Response
  ) => {
    request.body.author = request.user._id;
    const store = new Store(request.body);
    await store.save();
    request.flash(
      "success",
      `Successfully created ${store.name}. Care to leave a review?`
    );
    response.redirect(`/store/${store.slug}`);
  };

  private getStores = async (
    request: express.Request,
    response: express.Response
  ) => {
    // 1. query the database for a list of all stores
    const stores = await Store.find();
    response.render("stores", { title: "Stores", stores });
  };

  private confirmOwner = (store: IStore, request: express.Request) => {
    if (store.author !== request.user._id) {
      throw Error("You must own a store in order to edit it!");
    }
  };

  private editStore = async (
    request: express.Request,
    response: express.Response
  ) => {
    // 1. find store given id
    const store: IStore | null = await Store.findOne({
      _id: request.params.id
    });
    if (store) {
      // 2. confirm they are owner of store
      this.confirmOwner(store, request);
      // 3. render out the edit form so the user can update their store
      response.render("editStore", { title: `Edit ${store!.name}`, store });
    }
  };

  private updateStore = async (
    request: express.Request,
    response: express.Response
  ) => {
    // 1. find and update the store
    request.body.location.type = "Point";
    const store = await Store.findOneAndUpdate(
      { _id: request.params.id },
      request.body,
      {
        new: true, // return new store instead of old
        runValidators: true // run the validators in schema before saving
      }
    ).exec();
    // 2. redirect them to the store and tell them it worked
    request.flash("success", `Successfully updated ${store!.name}`);
    response.redirect(`/stores/${store!._id}/edit`);
  };

  private getStoreBySlug = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    console.log(`params: ${request.params}`);
    const store = await Store.findOne({ slug: request.params.slug }).populate(
      "author"
    );
    if (!store) {
      next();
      return;
    }
    response.render("store", { title: `Welcome to ${store.name}`, store });
  };

  private getStoresByTag = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const tag = request.params.tag;
    const tagQuery = tag || { $exists: true };
    const tagsPromise = (Store as any).getTagsList();
    const storesPromise = Store.find({ tags: tagQuery });
    const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
    response.render("tag", { tag, tags, stores, title: "Tags" });
  };

  private searchStores = async (
    request: express.Request,
    response: express.Response
  ) => {
    response.json(request.query);
  };
}

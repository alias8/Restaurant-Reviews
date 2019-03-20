import { IController } from '../app';
import express from "express";

export class UserController implements IController {
	public router = express.Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get("/", (req, res) => {
			return res.render('hello');
		});
	}
}

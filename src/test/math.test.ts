import request from "supertest";
import { app } from "../server";

test("Hello world", () => {
    const a = 2;
    console.log(`process.env.DATABASE: ${process.env.DATABASE}`);
});

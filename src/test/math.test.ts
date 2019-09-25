import request from "supertest";
import { app } from "../server";

test("Hello world", async () => {
    console.log(`process.env.DATABASE: ${process.env.DATABASE}`);
    await request(app)
        .get("/james")
        .expect(200);
});

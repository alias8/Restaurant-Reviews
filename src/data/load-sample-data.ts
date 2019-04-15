console.log("james1");
import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import * as path from "path";
import { rootDirectory } from "../app";
import { Store } from "../models/Store";
import { User } from "../models/User";

dotenv.config({ path: rootDirectory });
mongoose.connect(process.env.DATABASE || "");

// import all of our models - they need to be imported only once

// const Review = require('../models/Review');

const stores = JSON.parse(
    fs.readFileSync(
        path.join(rootDirectory, "src", "data", "stores.json"),
        "utf-8"
    )
);
// const reviews = JSON.parse(fs.readFileSync(__dirname + '/reviews.json', 'utf-8'));
const users = JSON.parse(
    fs.readFileSync(
        path.join(rootDirectory, "src", "data", "users.json"),
        "utf-8"
    )
);

async function deleteData() {
    console.log("😢😢 Goodbye Data...");
    await Store.remove({});
    console.log("1111");
    // await Review.remove();
    await User.remove({});
    console.log(
        "Data Deleted. To load sample data, run\n\n\t npm run sample\n\n"
    );
    process.exit();
}

async function loadData() {
    try {
        await Store.insertMany(stores);
        // await Review.insertMany(reviews);
        await User.insertMany(users);
        console.log("👍👍👍👍👍👍👍👍 Done!");
        process.exit();
    } catch (e) {
        console.log(
            "\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n"
        );
        console.log(e);
        process.exit();
    }
}

process.argv.forEach(arg => {
    console.log(`james ${arg}`);
});

if (process.argv.includes("--delete")) {
    deleteData();
} else {
    loadData();
}

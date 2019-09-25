// tslint:disable:no-var-requires
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config({ path: path.join("..", "config", "test.env") });
mongoose.connect(process.env.DATABASE || "", {
    useCreateIndex: true,
    useNewUrlParser: true
});

console.log(
    `process.env.DATABASE setup: ${process.env.DATABASE} ---- ${path.join(
        "..",
        "config",
        "test.env"
    )}`
);

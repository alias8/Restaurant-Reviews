// tslint:disable:no-var-requires
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config({
    path: path.resolve(__dirname, "..", "config", "test", ".env")
});
// mongoose.connect(process.env.DATABASE || "", {
//     useCreateIndex: true,
//     useNewUrlParser: true
// });

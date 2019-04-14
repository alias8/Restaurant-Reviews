import * as mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    author: {
        ref: "User",
        required: "You must supply an author!",
        type: mongoose.Schema.Types.Date
    },
    created: {
        default: Date.now(),
        type: mongoose.Schema.Types.Date
    },
    rating: {
        max: 5,
        min: 1,
        type: mongoose.Schema.Types.Number
    },
    store: {
        ref: "Store",
        required: "You must supply a store!",
        type: mongoose.Schema.Types.ObjectId
    },
    text: {
        required: "Your review must have text!",
        type: mongoose.Schema.Types.String
    }
});

function autopopulate(next: any) {
    this.populate("author");
    next();
}

reviewSchema.pre("find", autopopulate);
reviewSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Review", reviewSchema);

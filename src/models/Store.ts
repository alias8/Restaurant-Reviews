import dompurify from "dompurify";
import mongoose from "mongoose";
import slug from "slugs";
import { DOMPurify } from "../helpers";

export interface IStore extends mongoose.Document {
    name: string;
    slug: string;
    description: string;
    tags: string;
    created: mongoose.Schema.Types.Date;
    location: {
        coordinates: number[];
        address: string;
    };
    photo: string;
    author: mongoose.Types.Buffer;
    getTagsList: () => any;
}

const storeSchema = new mongoose.Schema<IStore>({
    author: {
        ref: "User",
        required: "You must supply an author",
        type: mongoose.Schema.Types.ObjectId
    },
    created: {
        default: Date.now(),
        type: mongoose.Schema.Types.Date
    },
    description: {
        trim: true,
        type: mongoose.Schema.Types.String
    },
    location: {
        address: {
            required: "You must supply an address!",
            type: mongoose.Schema.Types.String
        },
        coordinates: [
            {
                required: "You must supply coordinates!",
                type: mongoose.Schema.Types.Number
            }
        ],
        type: {
            default: "Point",
            type: mongoose.Schema.Types.String
        }
    },
    name: {
        required: "Please enter a store name",
        trim: true,
        type: mongoose.Schema.Types.String
    },
    slug: mongoose.Schema.Types.String,
    tags: [mongoose.Schema.Types.String],

    photo: mongoose.Schema.Types.String
});

storeSchema.index({
    description: "text",
    name: "text"
});

storeSchema.index({
    location: "2dsphere"
});

// find reviews where the stores _id property === reviews store property
storeSchema.virtual("reviews", {
    foreignField: "store",
    localField: "_id",
    ref: "Review"
});

// tslint:disable-next-line:only-arrow-functions console.log("hello")
storeSchema.pre("validate", async function(next) {
    // todo: somehow validate / sanitise using a pre hook or a validation option in the schema
    this.validateSync();
    next();
});

// tslint:disable-next-line:only-arrow-functions
storeSchema.pre("save", async function(next) {
    const that = this as IStore;
    if (!this.isModified("name")) {
        next();
        return;
    }

    that.slug = slug(that.name);
    // find other stores that have a slug of wes, wes-1, wes-2
    const slugRegEx = new RegExp(`^(${that.slug})((-/d*)?)$`, "i");
    const storesWithSlug = await Store.find({ slug: slugRegEx });

    if (storesWithSlug.length) {
        that.slug = `${that.slug}-${storesWithSlug.length + 1}`;
    }

    // sanitize all text inputs
    that.name = DOMPurify.sanitize(that.name);
    that.description = DOMPurify.sanitize(that.description);
    that.location.address = DOMPurify.sanitize(that.description);

    next();
});

storeSchema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
};

export const Store: mongoose.Model<IStore> = mongoose.model<IStore>(
    "Store",
    storeSchema
);

import * as mongoose from "mongoose";
import slug from "slugs";

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
  author: string;
  getTagsList: () => any;
}

const storeSchema = new mongoose.Schema({
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

// tslint:disable-next-line:only-arrow-functions
storeSchema.pre("save", async function(next) {
  if (!this.isModified("name")) {
    next();
    return;
  }
  (this as IStore).slug = slug((this as IStore).name);
  // find other stores that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${(this as IStore).slug})(-/d*)?`, "i");
  const storesWithSlug = await Store.find({ slug: slugRegEx });

  if (storesWithSlug.length) {
    (this as IStore).slug = `${(this as IStore).slug}-${storesWithSlug.length +
      1}`;
  }
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

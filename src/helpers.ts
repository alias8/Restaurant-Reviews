import fs from "fs";
import momentImport from "moment";
import { staticDirectory } from "./paths";

import createDOMPurify from "dompurify";

import { JSDOM } from "jsdom";

export const moment = momentImport;

// A handy debugging function we can use to sort of "console.log" our data
export const print = (obj: {}) => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
export const staticMap = ([lng, lat]: string[]) =>
    `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${
        process.env.MAP_KEY
    }&markers=${lat},${lng}&scale=2`;

// inserting an SVG
export const icon = (name: string) => {
    return fs.readFileSync(`${staticDirectory}/images/icons/${name}.svg`);
};

// Some details about the site
export const siteName = `Now That's Delicious!`;

export const menu = [
    { slug: "/stores", title: "Stores", icon: "store" },
    { slug: "/tags", title: "Tags", icon: "tag" },
    { slug: "/top", title: "Top", icon: "top" },
    { slug: "/add", title: "Add", icon: "add" },
    { slug: "/map", title: "Map", icon: "map" }
];

// set up dompurify for nodejs
const window = new JSDOM("").window;
// @ts-ignore
export const DOMPurify = createDOMPurify(window);

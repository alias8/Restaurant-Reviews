import fs from "fs";

// Dump is a handy debugging function we can use to sort of "console.log" our data
export const dump = (obj: {}) => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
export const staticMap = ([lng, lat]: string[]) =>
  `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${
    process.env.MAP_KEY
    }&markers=${lat},${lng}&scale=2`;

// inserting an SVG
export const icon = (name: string) =>
  fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
export const siteName = `Now That's Delicious!`;

export const menu = [
  { slug: "/stores", title: "Stores", icon: "store" },
  { slug: "/tags", title: "Tags", icon: "tag" },
  { slug: "/top", title: "Top", icon: "top" },
  { slug: "/add", title: "Add", icon: "add" },
  { slug: "/map", title: "Map", icon: "map" }
];

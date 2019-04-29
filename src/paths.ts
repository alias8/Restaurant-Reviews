import * as path from "path";

/*
 * Since the source code is bundled in src/public/dist, we have to refer to
 * directories in relation to the bundled code, not the typescript files.
 * */
export const publicDirectory = path.join(__dirname, "..");
export const rootDirectory = path.join(__dirname, "..", "..", "..");
export const viewDirectory = path.join(__dirname, "..", "..", "views");

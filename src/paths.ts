import * as path from "path";

/*
 * Since the source code is bundled in dist, we have to refer to
 * directories in relation to the bundled js code, not the typescript files.
 * */
export const rootDirectory = path.join(__dirname, "..", "..", "..");
export const staticDirectory = path.join(rootDirectory, "src", "public");
export const viewDirectory = path.join(rootDirectory, "src", "views");

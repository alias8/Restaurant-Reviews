import * as path from "path";

/*
 * Since the source code is bundled in dist, we have to refer to
 * directories in relation to the bundled js code, not the typescript files.
 * */
export const staticDirectory = path.join(__dirname, "..");
export const rootDirectory = path.join(staticDirectory, "..", "..");
export const viewDirectory = path.join(staticDirectory, "..", "views");

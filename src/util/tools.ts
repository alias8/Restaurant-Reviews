import { autocomplete } from "./autocomplete";
import { $, $$ } from "./bling";
import { ajaxHeart } from "./heart";
import { makeMap } from "./map";
import { typeAhead } from "./typeAhead";

autocomplete($("#address"), $("#lat"), $("#lng"));

typeAhead($(".search"));

makeMap($("#map"));

const heartForms = $$("form.heart");
heartForms.on("submit", ajaxHeart);
console.log(heartForms);

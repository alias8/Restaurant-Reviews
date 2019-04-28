import { autocomplete } from "./autocomplete";
import { $, $$, IBling } from "./bling";
import { ajaxHeart } from "./heart";
import { makeMap } from "./map";
import { typeAhead } from "./typeAhead";

autocomplete($("#address"), $("#lat"), $("#lng"));

typeAhead($(".search"));

makeMap($("#map"));

const heartForms = $$("form.heart")[0];
(heartForms as IBling).on("submit", ajaxHeart);
console.log(heartForms);

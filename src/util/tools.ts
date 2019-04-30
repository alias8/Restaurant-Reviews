import { autocomplete } from "./autocomplete";
import { $, $$, IBling } from "./bling";
import { ajaxHeart } from "./heart";
import { makeMap } from "./map";
import { typeAhead } from "./typeAhead";

autocomplete($("#address"), $("#lat"), $("#lng"));

typeAhead($(".search"));

makeMap($("#map"));

const heartForms = $$("form.heart");
if (heartForms.length > 0) {
    heartForms.forEach(heartForm => {
        (heartForm as IBling).on("submit", ajaxHeart);
    });
}

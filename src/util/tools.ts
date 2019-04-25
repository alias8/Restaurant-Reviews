import { autocomplete } from "./autocomplete";
import { $ } from "./bling";
import { makeMap } from "./map";
import { typeAhead } from "./typeAhead";

autocomplete($("#address"), $("#lat"), $("#lng"));

typeAhead($(".search"));

makeMap($("#map"));

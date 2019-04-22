import { autocomplete } from "./autocomplete";
import { $ } from "./bling";
import { typeAhead } from "./typeAhead";

autocomplete($("#address"), $("#lat"), $("#lng"));

typeAhead($(".search"));

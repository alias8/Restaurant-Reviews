import { IBling } from "./bling";

export function autocomplete(
  input: HTMLInputElement | null,
  latInput: HTMLInputElement | null,
  lngInput: HTMLInputElement | null
) {
  if (!input) {
    return;
  }
  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener("place_changed", () => {
    const place = dropdown.getPlace();
    if (place && place.geometry) {
      (latInput as any).value = place.geometry.location.lat();
      (lngInput as any).value = place.geometry.location.lng();
    }
  });
  // if someone hits enter on the address field, don't submit the form
  (input as IBling).on("keydown", (e: any) => {
    if (e.key === 13) {
      e.preventDefault();
    }
  });
}

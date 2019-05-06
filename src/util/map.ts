import axios, { AxiosResponse } from "axios";
import { IStoreDocument } from "../models/Store";
import { $ } from "./bling";

const mapOptions = {
    center: {
        lat: 43.2,
        lng: -79.2
    },
    zoom: 2
};

function loadPlaces(map: google.maps.Map, lat = 43.2, lng = -79.8) {
    axios
        .get(`/api/stores/near?lat=${lat}&lng=${lng}`)
        .then((result: AxiosResponse<IStoreDocument[]>) => {
            const places = result.data;
            if (!places.length) {
                alert("no places found!");
                return;
            }

            const bounds = new google.maps.LatLngBounds();
            const infoWindow = new google.maps.InfoWindow();

            const markers: google.maps.Marker[] = places.map(
                (place: IStoreDocument) => {
                    const [placeLng, placeLat] = place.location.coordinates;
                    const position = { lat: placeLat, lng: placeLng };
                    bounds.extend(position);
                    const marker = new google.maps.Marker({
                        map,
                        position
                    });
                    marker.setPlace({
                        location: {
                            lat: placeLat,
                            lng: placeLng
                        },
                        query: place.name
                    });
                    marker.setValues({
                        info: {
                            address: place.location.address,
                            name: place.name,
                            photo: place.photo,
                            slug: place.slug
                        }
                    });
                    return marker;
                }
            );

            markers.forEach(marker => {
                marker.addListener("click", function() {
                    const info = this.get("info");
                    const { address, name, photo, slug } = info;
                    const html = `
<div class="popup">
    <a href=/store/${slug}>
        <img src="/uploads/${photo || "store.png"}" alt="${name}"/>
        <p>${name} - ${address}</p>
    </a>                    
</div>
                    `;
                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                });
            });

            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        });
}

export function makeMap(mapDiv: HTMLInputElement | null) {
    if (!mapDiv) {
        return;
    }
    // make our map
    const map = new google.maps.Map(mapDiv, mapOptions);
    loadPlaces(map);
    const input = $('[name="geolocate"]') as HTMLInputElement;
    if (input) {
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            map.setCenter({
                lat: place.geometry!.location.lat(),
                lng: place.geometry!.location.lng()
            });
        });
    }
}

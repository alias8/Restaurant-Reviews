import axios from "axios";
import { IStore } from "../models/Store";
import { $ } from "./bling";

const mapOptions = {
    center: {
        lat: 43.2,
        lng: -79.2
    },
    zoom: 2
};

function loadPlaces(map: google.maps.Map, lat = 43.2, lng = -79.8) {
    axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`).then(result => {
        const places = result.data;
        if (!places.length) {
            alert("no places found!");
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        const infoWindow = new google.maps.InfoWindow();

        const markers: google.maps.Marker[] = places.map((place: IStore) => {
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
                placeId: place._id
            });
            return marker;
        });

        markers.forEach(marker => {
            marker.addListener("click", function() {
                const html = `
<div class="popup">
    <a href=/store/${this.place.slug}">
        <img src="/uploads/${this.place.photo || "store.png"}" alt="${
                    this.place.name
                }"/>
        <p>${this.place.name} - ${this.place.location.address}</p>
    </a>                    
</div>
                    `;
                infoWindow.setContent(this.place.name);
                infoWindow.open(map, this);
            });
        });

        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
    });
}

export function makeMap(mapDiv: HTMLInputElement | null) {
    console.log(`james111 ${mapDiv}`);
    // make our map
    const map = new google.maps.Map(mapDiv, mapOptions);
    loadPlaces(map);
    const input = $('[name="geolocate"]') as HTMLInputElement;
    if (input) {
        const autocomplete = new google.maps.places.Autocomplete(input);
    }
}

import axios from "axios";
import dompurify from "dompurify";
import { IStore } from "../models/Store";
import { IBling } from "./bling";

export function searchResultsHTML(stores: IStore[]) {
    const html = stores
        .map(store => {
            return `
            <a href="/store/${store.slug}" class="search__result">
                <strong>${store.name}</strong>
            </a>
        `;
        })
        .join("");

    return dompurify.sanitize(html);
}

export function typeAhead(search: Element | null) {
    if (!search) {
        return;
    }
    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector(
        ".search__results"
    ) as HTMLDivElement;

    (searchInput as IBling).on("input", function() {
        if (!this.value) {
            searchResults.style.display = "none";
            return;
        }

        // show the search results
        searchResults.style.display = "block";
        searchResults.innerHTML = "";

        axios
            .get(`/api/search?q=${this.value}`)
            .then(result => {
                if (result.data.length) {
                    searchResults.innerHTML = searchResultsHTML(result.data);
                    return;
                } else {
                    searchResults.innerHTML = dompurify.sanitize(
                        `<div class="search__result">No results found for ${
                            this.value
                        }</div>`
                    );
                }
            })
            .catch(error => {
                console.error(error);
            });
    });

    (searchInput as IBling).on("keyup", e => {
        const activeClass = "search__result--active";
        const current = search.querySelector(
            `.${activeClass}`
        ) as HTMLAnchorElement;
        const items = search.querySelectorAll(".search__result");
        let next;
        switch (e.keyCode) {
            case 38: // UP
                if (current) {
                    next =
                        current.previousElementSibling ||
                        items[items.length - 1];
                } else {
                    next = items[items.length - 1];
                }
                next.classList.add(activeClass);
                break;
            case 40: // DOWN
                if (current) {
                    next = current.nextElementSibling || items[0];
                } else {
                    next = items[0];
                }
                next.classList.add(activeClass);
                break;
            case 13:
                if (current.href) {
                    window.location.href = current.href;
                    return;
                }
                break;
            default:
                return;
        }
        if (current) {
            current.classList.remove(activeClass);
        }
    });
}

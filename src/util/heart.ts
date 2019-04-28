import axios from "axios";
import { $ } from "./bling";

export function ajaxHeart(e: HTMLFormElement) {
    e.preventDefault();
    axios
        .post(this.action)
        .then(result => {
            const isHearted = this.heart.classList.toggle(
                "heart__button--hearted"
            );
            const heartCount = $(".heart-count");
            if (heartCount) {
                heartCount.textContent = result.data.hearts.length;
            }
            if (isHearted) {
                this.heart.classList.add("heart__button--float");
                setTimeout(() => {
                    this.heart.classList.remove("heart__button--float");
                }, 2600);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

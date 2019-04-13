// based on https://gist.github.com/paulirish/12fb951a8b893a454b32

export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

(Node.prototype as any).on = (window as any).on = function(
    name: string,
    fn: any
) {
    this.addEventListener(name, fn);
};

(NodeList.prototype as any).__proto__ = Array.prototype; // eslint-disable-line

(NodeList.prototype as any).on = (NodeList.prototype as any).addEventListener = function(
    name: string,
    fn: any
) {
    this.forEach((elem: any) => {
        elem.on(name, fn);
    });
};

export interface IBling extends HTMLInputElement {
    on: (keyword: string, handler: (event: any) => void) => void;
}

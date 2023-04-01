export const canvas = /** @type { HTMLCanvasElement } */
(document.querySelector("canvas"));

export const ctx = /** @type { CanvasRenderingContext2D } */
(canvas.getContext("2d"));

export const input = /** @type { HTMLInputElement } */
(document.querySelector("input[type='file']"));

export const progress = /** @type { HTMLProgressElement } */
(document.querySelector("progress"));

export const grid = /** @type { HTMLDivElement } */
(document.querySelector("div[data-grid]"));
export const canvas = document.querySelector("canvas")!;
export const ctx = canvas.getContext("2d")!;
export const songInput = document.querySelector<HTMLInputElement>("#songInput")!;
export const songNamesEditor = document.querySelector<HTMLTextAreaElement>("#songNamesEditor")!;
export const artworkInput = document.querySelector<HTMLInputElement>("#artworkInput")!;
export const progress = document.querySelector("progress")!;
export const grid = document.querySelector<HTMLDivElement>("div[data-grid]")!;
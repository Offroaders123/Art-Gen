'use strict'

import stringWidth from "string-width";

interface alignOpts {

	align: string
	split: string
	pad: string

}

export function defaultAlignOpts(): alignOpts {
	return {
		align: "center",
		split: "\n",
		pad: " "
	}
}

export class Aligner {

	private opts: alignOpts;

	constructor(opts: alignOpts) {
		this.opts = opts;
	}

	public align(text: string): string {
		return ansiAlign(text, this.opts);
	}

}

function ansiAlign(text: any, opts: alignOpts): string {
	if (typeof text == "undefined") return ""

	opts = opts || {}
	const align = opts.align || 'center'

	// short-circuit `align: 'left'` as no-op
	if (align === 'left') return text

	const split = opts.split || '\n'
	const pad = opts.pad || ' '
	const widthDiffFn = align !== 'right' ? halfDiff : fullDiff
	var textArray: string[] = [];

	let returnString = false
	if (!Array.isArray(text)) {
		returnString = true
		textArray = String(text).split(split)
	}

	let width
	let maxWidth = process.stdout.columns;
	textArray = textArray.map(function (str) {
		str = String(str)
		width = stringWidth(str)
		maxWidth = Math.max(width, maxWidth)
		return {
			str,
			width
		}
	}).map(function (obj) {
		return new Array(widthDiffFn(maxWidth, obj.width) + 1).join(pad) + obj.str
	})

	return returnString ? textArray.join(split) : text
}

ansiAlign.left = function left(text: string): string {
	return ansiAlign(text, { align: 'left', split: "\n", pad: " " })
}

ansiAlign.center = function center(text: string): string {
	return ansiAlign(text, { align: 'center', split: "\n", pad: " " })
}

ansiAlign.right = function right(text: string): string {
	return ansiAlign(text, { align: 'right', split: "\n", pad: " " })
}

export default ansiAlign;

function halfDiff(maxWidth: number, curWidth: number): number {
	return Math.floor((maxWidth - curWidth) / 2)
}

function fullDiff(maxWidth: number, curWidth: number): number {
	return maxWidth - curWidth
}

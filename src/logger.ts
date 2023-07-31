import chalk from "chalk";
import { Aligner, defaultAlignOpts } from "./aligner";

interface LoggerOpts {

	format: string;
	debugLevel: number
	center: boolean

}

export const LevelColors = [
	"blue",
	"gray",
	"yellow",
	"red",
	"bgRed"
]
export const Levels = [
	'INFO',
	'DEBUG',
	'WARNING',
	'ERROR',
	'CRITICAL'
]

export function newLogger(opts: LoggerOpts): Logger {
	return new Logger(opts);
}
export function defaultLoggerOpts(debug: boolean = false): LoggerOpts {
	return {
		format: "[%level%]%sp% %message%",
		debugLevel: debug ? 1 : 0,
		center: false
	}
}

class Logger {

	private format: string;
	private debugLevel: number;
	private center: boolean;
	private aligner: Aligner

	constructor(opts: LoggerOpts) {
		console.clear();
		this.format = opts.format;
		this.debugLevel = opts.debugLevel;
		this.center = opts.center;
		this.aligner = new Aligner(defaultAlignOpts())
	}

	public getFormat(): string {
		return this.format;
	}
	public debugEnabled(): boolean {
		return this.debugLevel > 0;
	}

	public log(...messages: any) {
		this.info(...messages);
	}
	public info(...messages: any) {
		for (var i in messages) {
			var message = messages[i];
			console.log(this.formatMessage(message, 0));
		}
	}
	public debug(...messages: any) {
		for (var i in messages) {
			var message = messages[i];
			if (this.debugEnabled()) console.log(this.formatMessage(message, 1));
		}
	}
	public warning(...messages: any) {
		for (var i in messages) {
			var message = messages[i];
			console.log(this.formatMessage(message, 2));
		}
	}
	public error(...messages: any) {
		for (var i in messages) {
			var message = messages[i];
			console.log(this.formatMessage(message, 3));
		}
	}
	public critical(...messages: any) {
		for (var i in messages) {
			var message = messages[i];
			console.log(this.formatMessage(message, 4));
		}
	}

	public debugLineBreak(count: number = 1) {
		if (this.debugEnabled()) for (var i = 0; i < count; i++) console.log();
	}
	public lineBreak(count: number = 1) {
		for (var i = 0; i < count; i++) console.log();
	}



	private formatMessage(message: any, level: number): any {
		if (!["string", "boolean", "number"].includes(typeof message)) {
			console.log(typeof message);
			var parts = ["[%level%]"]
			if (this.center) {
				switch (LevelColors[level]) {
					case "blue":
						parts[0] = chalk.blue.dim.bgBlack(parts[0]);
						break;
					case "gray":
						parts[0] = chalk.gray.dim.bgBlack(parts[0]);
						break;
					case "yellow":
						parts[0] = chalk.yellow.dim.bgBlack(parts[0]);
						break;
					case "red":
						parts[0] = chalk.redBright.dim.bgBlack(parts[0]);
						break;
					case "bgRed":
						parts[0] = chalk.red.dim.bold(parts[0]);
						break;
				}
			} else {
				switch (LevelColors[level]) {
					case "blue":
						parts[0] = chalk.blue.bgBlack(parts[0]);
						break;
					case "gray":
						parts[0] = chalk.gray.bgBlack(parts[0]);
						break;
					case "yellow":
						parts[0] = chalk.yellow.bgBlack(parts[0]);
						break;
					case "red":
						parts[0] = chalk.redBright.bgBlack(parts[0]);
						break;
					case "bgRed":
						parts[0] = chalk.red.bold(parts[0]);
						break;
				}
			}
			parts[0] = parts[0].split("%level%").join(Levels[level]);
			if (this.center) {
				console.log(this.aligner.align(parts[0]));
				return this.aligner.align(message);
			}
			console.log(parts[0]);
			return message;
		}
		message = message.toString();
		var parts = this.format.split('%sp%');
		if (this.center) {
			switch (LevelColors[level]) {
				case "blue":
					parts[0] = chalk.blue.dim.bgBlack(parts[0]);
					break;
				case "gray":
					parts[0] = chalk.gray.dim.bgBlack(parts[0]);
					break;
				case "yellow":
					parts[0] = chalk.yellow.dim.bgBlack(parts[0]);
					break;
				case "red":
					parts[0] = chalk.redBright.dim.bgBlack(parts[0]);
					break;
				case "bgRed":
					parts[0] = chalk.red.dim.bold(parts[0]);
					break;
			}
		} else {
			switch (LevelColors[level]) {
				case "blue":
					parts[0] = chalk.blue.bgBlack(parts[0]);
					break;
				case "gray":
					parts[0] = chalk.gray.bgBlack(parts[0]);
					break;
				case "yellow":
					parts[0] = chalk.yellow.bgBlack(parts[0]);
					break;
				case "red":
					parts[0] = chalk.redBright.bgBlack(parts[0]);
					break;
				case "bgRed":
					parts[0] = chalk.red.bold(parts[0]);
					break;
			}
		}

		parts[0] = parts[0].split("%level%").join(Levels[level]);
		parts[1] = parts[1].split("%message%").join(message);

		if (this.center) {
			console.log(this.aligner.align(parts[0]));
			return this.aligner.align(parts[1]);
		}

		return parts.join("");
	}

}
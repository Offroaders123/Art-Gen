import chalk from "chalk";

interface LoggerOpts {

	format: string;
	debugLevel: number

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
		debugLevel: debug ? 1 : 0
	}
}

class Logger {

	private format: string;
	private debugLevel: number;

	constructor(opts: LoggerOpts) {
		this.format = opts.format;
		this.debugLevel = opts.debugLevel;
	}

	public getFormat(): string {
		return this.format;
	}
	public debugEnabled(): boolean {
		return this.debugLevel > 0;
	}

	public log(message: any) {
		this.info(message);
	}
	public info(message: any) {
		console.log(this.formatMessage(message, 0));
	}
	public debug(message: any) {
		if (this.debugEnabled()) console.log(this.formatMessage(message, 1));
	}
	public warning(message: any) {
		console.log(this.formatMessage(message, 2));
	}
	public error(message: any) {
		console.log(this.formatMessage(message, 3));
	}
	public critical(message: any) {
		console.log(this.formatMessage(message, 4));
	}



	private formatMessage(message: any, level: number): any {
		if (!["string", "boolean", "number"].includes(typeof message)) {
			var parts = ["[%level%]"]
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
			parts[0] = parts[0].split("%level%").join(Levels[level]);
			console.log(parts[0]);
			return message;
		}
		message = message.toString();
		var parts = this.format.split('%sp%');
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

		parts[0] = parts[0].split("%level%").join(Levels[level]);
		parts[1] = parts[1].split("%message%").join(message);

		return parts.join("");
	}

}
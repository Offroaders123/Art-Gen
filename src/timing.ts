import { Logger } from ".";

export class Timer {

	private addedTime: number = 0;
	private _start: number = 0;

	public start() {
		if (this._start > 0) return;
		this._start = Date.now();
	}

	public stop() {
		this.addedTime += Date.now() - this._start;
		this._start = 0;
	}

	public resume() {
		this.start();
	}

	public reset() {
		this.stop()
		this.addedTime = 0;
	}

	public getTime(): number {
		return this.addedTime;
	}

}
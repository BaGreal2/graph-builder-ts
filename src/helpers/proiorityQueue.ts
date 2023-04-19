class Item<T> {
	constructor(public value: T, public priority: number) {
		this.value = value;
		this.priority = priority;
	}
}

export default class PriorityQueue<T> {
	private _queue: Item<T>[];
	private _curr = -1;

	constructor() {
		this._queue = [];
	}

	public enqueue(value: T, priority: number) {
		this._curr++;

		this._queue[this._curr] = new Item<T>(value, priority);
	}

	private _peek() {
		let highestPriority = Number.MIN_SAFE_INTEGER;
		let ind = -1;

		for (let i = 0; i <= this._curr; i++) {
			if (
				highestPriority < this._queue[i].priority ||
				(highestPriority === this._queue[i].priority &&
					this._queue[ind].value > this._queue[i].value)
			) {
				highestPriority = this._queue[i].priority;
				ind = i;
			}
		}

		return ind;
	}

	public dequeue(): Item<T> {
		const ind = this._peek();
		const elem = this._queue[ind];
		this._queue[ind] = this._queue[this._curr];
		this._queue.pop();
		this._curr--;
		return elem;
	}

	public get length() {
		return this._queue.length;
	}
}

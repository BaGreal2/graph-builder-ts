export default class DisjointSet {
	private parent: number[];
	private rank: number[];

	constructor(size: number) {
		this.parent = Array(size)
			.fill(0)
			.map((_, i) => i);
		this.rank = Array(size).fill(0);
	}

	find(x: number): number {
		if (this.parent[x] !== x) {
			this.parent[x] = this.find(this.parent[x]);
		}
		return this.parent[x];
	}

	union(x: number, y: number): boolean {
		const rootX = this.find(x);
		const rootY = this.find(y);
		if (rootX === rootY) {
			return false;
		}
		if (this.rank[rootX] < this.rank[rootY]) {
			this.parent[rootX] = rootY;
		} else if (this.rank[rootX] > this.rank[rootY]) {
			this.parent[rootY] = rootX;
		} else {
			this.parent[rootY] = rootX;
			this.rank[rootX]++;
		}
		return true;
	}
}

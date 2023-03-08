export interface INode {
	index: number;
	x: number;
	y: number;
	radius: number;
	connections: [number, number | null][];
}

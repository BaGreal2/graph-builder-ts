export interface IEdge {
	from: number;
	to: number;
	index1: number;
	index2: number;
	weight: number | null;
	points: number[];
	type: string;
	state: 'visited' | 'dead-end' | '';
}

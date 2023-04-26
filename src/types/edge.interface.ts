export interface IEdge {
	from: number;
	to: number;
	weight: number | null;
	points: number[];
	type: 'direct' | 'undirect';
	state: 'visited' | 'dead-end' | '';
}

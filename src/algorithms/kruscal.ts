import { DisjointSet } from '../helpers';
import { IEdge, INode, IStep } from '../types';

export default function kruscal(
	nodes: INode[],
	edges: IEdge[]
): [IStep[], IEdge[]] {
	const F: IEdge[] = [];
	const disjointSet = new DisjointSet(nodes.length);
	const path: IStep[] = [];

	nodes.forEach((node) => disjointSet.find(node.index - 1));

	edges.sort((a, b) => a.weight! - b.weight!);

	edges.forEach((edge) => {
		path.push({
			stepType: 'edge',
			state: 'dead-end',
			edgeIndexes: [edge.to, edge.from],
			oneDirection: true,
		});

		if (disjointSet.union(edge.from - 1, edge.to - 1)) {
			path.push({
				stepType: 'edge',
				state: 'visited',
				edgeIndexes: [edge.from, edge.to],
			});

			const reverseEdge: IEdge = {
				...edge,
				from: edge.to,
				to: edge.from,
			};

			F.push(edge, reverseEdge);
		}
	});

	return [path, F];
}

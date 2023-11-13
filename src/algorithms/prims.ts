import { IEdge, INode, IStep } from '../types';

export default function prims(
	nodes: INode[],
	edges: IEdge[],
	startNode: INode
): IStep[] {
	const mst = new Set<INode>();
	const steps: IStep[] = [];
	mst.add(startNode);

	const edgesTree: IEdge[] = [];
	edges.forEach((edge) => {
		if ((edge.from = startNode.index)) {
			edgesTree.push(edge);
		}
	});
	console.log(edges);
	while (mst.size < nodes.length) {
		const minEdge = findMinEdge(edgesTree);
		console.log(mst.size);

		if (!mst.has(nodes[minEdge.to - 1])) {
			steps.push(
				{
					stepType: 'edge',
					state: 'visited',
					edgeIndexes: [minEdge.from, minEdge.to],
				},
				{
					stepType: 'node',
					state: 'visited',
					nodeIndex: minEdge.to,
				}
			);
		}
		mst.add(nodes[minEdge.to - 1]);

		for (const connection of nodes[minEdge.to - 1].connections) {
			const currNode = nodes[connection[0] - 1];
			if (!mst.has(currNode)) {
				edges.forEach((edge) => {
					if ((edge.to = connection[0])) {
						edgesTree.push(edge);
					}
				});
			}
		}
		edgesTree.splice(edges.indexOf(minEdge), 1);
	}

	console.log(mst);
	return steps;
}

function findMinEdge(edges: IEdge[]) {
	let ref = edges[0];
	for (const edge of edges) {
		if (edge.weight! < ref.weight!) {
			ref = edge;
		}
	}

	return ref;
}

import { Dispatch, SetStateAction } from 'react';
import { dfsPath } from '../helpers';
import { IEdge, INode } from '../types';

export default async function topSort(
	nodes: INode[],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	setPath: Dispatch<SetStateAction<number[]>>,
	setShowModal: Dispatch<SetStateAction<{ text: string; confirm?: boolean }>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>
) {
	const visited = new Array(nodes.length).fill(false);
	const deadEnds = new Array(nodes.length).fill(false);
	const ordering: number[] = new Array(nodes.length).fill(0);
	let i = nodes.length - 1;

	for (let at = 0; at < nodes.length; at++) {
		if (!visited[at]) {
			const visitedNodes: number[] = [];
			await dfsPath(
				nodes,
				visited,
				deadEnds,
				visitedNodes,
				nodes[at],
				setViewVisited,
				setViewDead,
				edges,
				setEdges
			);
			visitedNodes.forEach((nodeId) => {
				ordering[i] = nodeId;
				i--;
			});
		}
	}

	setPath(ordering);
	setShowModal({
		text: ordering.toString().split(',').join('-'),
		confirm: true,
	});
}

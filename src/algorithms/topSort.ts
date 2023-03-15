import { Dispatch, SetStateAction } from 'react';
import { depthFirstSearch } from '.';
import { IEdge, INode } from '../types';

export default async function topSort(
	nodes: INode[],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	setPath: Dispatch<SetStateAction<number[]>>,
	setShowModal: Dispatch<SetStateAction<{ text: string; confirm?: boolean }>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>,
	speed: number
) {
	setViewDead([]);
	setViewVisited([]);
	const visited = new Array(nodes.length).fill(false);
	const deadEnds = new Array(nodes.length).fill(false);
	const ordering = new Array(nodes.length).fill(0);
	const edgesCopy = [...edges];

	if (edgesCopy.some((edge) => edge.type === 'undirect')) {
		setShowModal({
			text: 'Not Possible! Not a directed graph!',
		});
		return;
	}
	edgesCopy.forEach((edge) => (edge.state = ''));

	let i = nodes.length - 1;

	for (let at = 0; at < nodes.length; at++) {
		if (!visited[at]) {
			const visitedNodes: number[] = [];
			await depthFirstSearch(
				nodes,
				visited,
				deadEnds,
				nodes[at],
				setViewVisited,
				setViewDead,
				edgesCopy,
				setEdges,
				speed,
				visitedNodes
			);
			visitedNodes.forEach((nodeId) => {
				ordering[i] = nodeId;
				i--;
			});
		}
	}

	if (ordering.every((nodeId) => nodeId === 0)) {
		edgesCopy.forEach((edge) => (edge.state = ''));
		setShowModal({
			text: 'Not Possible! Cycle!',
		});
		setViewVisited([]);
		setViewDead([]);
		setEdges([...edgesCopy]);
	} else {
		setPath(ordering);
		setShowModal({
			text: ordering.toString().split(',').join('-'),
			confirm: true,
		});
	}
}

import { Dispatch, SetStateAction } from 'react';
import { depthFirstSearch } from '.';
import { drawStepsPath } from '../helpers';
import { IEdge, INode } from '../types';

export default async function topSort(
	nodes: INode[],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	setPath: Dispatch<SetStateAction<number[]>>,
	setShowModal: Dispatch<SetStateAction<{ text: string; confirm?: boolean }>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>,
	additionalNums: [number | null, number | null][],
	setAdditionalNums: Dispatch<SetStateAction<[number | null, number | null][]>>,
	speed: number
) {
	setViewDead([]);
	setViewVisited([]);
	const visited = new Array(nodes.length).fill(false);
	let viewVisited = new Array(nodes.length).fill(false);
	const deadEnds = new Array(nodes.length).fill(false);
	let viewDeadEnds = new Array(nodes.length).fill(false);
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
			const path = depthFirstSearch(
				nodes,
				visited,
				deadEnds,
				nodes[at],
				visitedNodes
			);

			if (path) {
				await drawStepsPath(
					path,
					viewVisited,
					viewDeadEnds,
					setViewVisited,
					setViewDead,
					edgesCopy,
					setEdges,
					additionalNums,
					setAdditionalNums,
					speed
				);
			}
			viewVisited = [...visited];
			viewDeadEnds = [...deadEnds];

			if (visitedNodes.length === 0) {
				edgesCopy.forEach((edge) => (edge.state = ''));
				setShowModal({
					text: 'Not Possible! Cycle!',
				});
				setViewVisited([]);
				setViewDead([]);
				setEdges([...edgesCopy]);
				return;
			}

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

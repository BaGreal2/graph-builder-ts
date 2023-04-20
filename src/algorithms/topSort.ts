import { Dispatch, SetStateAction } from 'react';
import { drawStepsPath } from '../helpers';
import { IEdge, INode, IStep } from '../types';

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
	const additionalNumsCopy = [...additionalNums];

	if (edgesCopy.some((edge) => edge.type === 'undirect')) {
		setShowModal({
			text: 'Not Possible! Not a directed graph!',
		});
		return;
	}
	edgesCopy.forEach((edge) => (edge.state = ''));

	let i = nodes.length - 1;
	let cnt = 1;

	for (let at = 0; at < nodes.length; at++) {
		if (!visited[at]) {
			const stack = [nodes[at]];
			const stepPath: IStep[] = [];
			const pathVisited = new Array(nodes.length).fill(false);
			let visitedNodes: number[] = [];
			let foundIndexGlobal: number;

			while (stack.length > 0) {
				const curr = stack[stack.length - 1];

				if (!visited[curr.index - 1]) {
					visited[curr.index - 1] = true;
					pathVisited[curr.index - 1] = true;
					stepPath.push(
						{
							stepType: 'node',
							nodeIndex: curr.index,
							state: 'visited',
						},
						{
							stepType: 'number',
							nodeIndex: curr.index,
							numberValue: cnt,
							state: '',
						}
					);
					cnt++;

					let foundIndexCurr: number;

					for (const connection of curr.connections) {
						if (!visited[connection[0] - 1]) {
							stack.push(nodes[connection[0] - 1]);
							foundIndexCurr = nodes[connection[0] - 1].index;
							break;
						} else if (pathVisited[connection[0] - 1] && visitedNodes) {
							visitedNodes = [];
							return;
						}
					}

					if (foundIndexCurr!) {
						stepPath.push({
							stepType: 'edge',
							edgeIndexes: [curr.index, foundIndexCurr!],
							state: 'visited',
						});
					}
					if (foundIndexGlobal!) {
						stepPath.push({
							stepType: 'edge',
							edgeIndexes: [curr.index, foundIndexGlobal!],
							state: 'visited',
						});
					}
				} else {
					if (
						curr.connections.every((connection) => visited[connection[0] - 1])
					) {
						deadEnds[curr.index - 1] = true;
						pathVisited[curr.index - 1] = false;
						if (visitedNodes) {
							if (!visitedNodes.includes(curr.index)) {
								visitedNodes.push(curr.index);
							}
						}

						stepPath.push(
							{
								stepType: 'node',
								nodeIndex: curr.index,
								state: 'dead-end',
							},
							{
								stepType: 'numberSecond',
								nodeIndex: curr.index,
								numberValue: cnt,
								state: '',
							}
						);
						stack.pop();
						stepPath.push({
							stepType: 'edge',
							edgeIndexes: [curr.index, stack[stack.length - 1]?.index],
							state: 'dead-end',
						});
					} else {
						// if there are unvisited neibours -> push to stack first of them
						for (const connection of curr.connections) {
							if (!visited[connection[0] - 1]) {
								stack.push(nodes[connection[0] - 1]);
								foundIndexGlobal = curr.index;
								break;
							}
						}
					}
				}
			}

			await drawStepsPath(
				stepPath,
				viewVisited,
				viewDeadEnds,
				setViewVisited,
				setViewDead,
				edgesCopy,
				setEdges,
				additionalNumsCopy,
				setAdditionalNums,
				speed
			);

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

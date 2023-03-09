import { Dispatch, SetStateAction } from 'react';
import { INode, IEdge } from '../types';

export default function eulersPath(
	nodes: INode[],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	setPath: Dispatch<SetStateAction<number[]>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>,
	setShowModal: Dispatch<SetStateAction<{ text: string; confirm?: boolean }>>
) {
	setViewDead([]);
	setViewVisited([]);

	const visited = new Array(nodes.length).fill(false);
	const deadEnds = new Array(nodes.length).fill(false);
	const path: number[] = [];
	const edgesCopy = [...edges];

	let startNode =
		nodes.find((node) => node.connections.length % 2 !== 0) || null;
	if (!startNode) {
		startNode = nodes[0];
	}
	const amountOfOdd = nodes.reduce((acc, node) => {
		if (node.connections.length % 2 !== 0) {
			return acc + 1;
		}
		return acc;
	}, 0);

	if (amountOfOdd !== 2 && amountOfOdd !== 0) {
		setShowModal({ text: 'Not possible to find path!' });
		return;
	}

	const stack: INode[] = [startNode!];

	// loop with a timeout
	const loop = setInterval(() => {
		// getting last node from stack
		const curr = stack[stack.length - 1];

		if (curr.connections.length === 0) {
			// if dead end -> go back in stack and push index from stack to path arr
			const elem = stack.pop();
			if (!elem) {
				return;
			}
			path.push(elem.index);

			// setting dead-end state
			edgesCopy.map((edge) => {
				if (
					(edge.from === curr.index &&
						edge.to === stack[stack.length - 1]?.index) ||
					(edge.to === curr.index &&
						edge.from === stack[stack.length - 1]?.index)
				) {
					edge.state = 'dead-end';
				}
			});
			deadEnds[curr.index - 1] = true;
			setEdges([...edgesCopy]);
			setViewDead([...deadEnds]);
		} else {
			// finding connection with minimal index
			const minConnection = curr.connections.reduce((min, connection) =>
				connection[0]! < min[0]! ? connection : min
			);
			const indexOfMin = minConnection[0]! - 1;
			const connectionFromIndex = curr.connections.indexOf(minConnection);
			const connectionToIndex = nodes[indexOfMin].connections.findIndex(
				(connection) => connection[0] === curr.index
			)!;

			// deleting connection
			nodes[curr.index - 1].connections.splice(connectionFromIndex, 1);
			nodes[indexOfMin].connections.splice(connectionToIndex, 1);

			// setting visited node state
			edgesCopy.map((edge) => {
				if (
					(edge.from === curr.index && edge.to === indexOfMin + 1) ||
					(edge.to === curr.index && edge.from === indexOfMin + 1)
				) {
					edge.state = 'visited';
				}
			});
			visited[curr.index - 1] = true;
			setEdges([...edgesCopy]);
			setViewVisited([...visited]);
			// pushing node with min index to stack
			stack.push(nodes[indexOfMin]);
		}

		// continue until stack is empty
		if (stack.length === 0) {
			clearInterval(loop);
			setPath([...path].reverse());
			let throwText = [...path].reverse().toString().split(',').join('-');
			if (path[path.length - 1] === path[0]) {
				throwText += ' cycle!';
			}
			setShowModal({
				text: throwText,
				confirm: true,
			});
		}
	}, 150);
}

import isGraphConnected from '../helpers/isGraphConnected';
import { INode, IStep } from '../types';

export default function eulerianPath(nodes: INode[]): [number[], IStep[]] {
	const visited = new Array(nodes.length).fill(false);
	const deadEnds = new Array(nodes.length).fill(false);
	const path: number[] = [];
	const stepPath: IStep[] = [];

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

	if (
		(amountOfOdd !== 2 && amountOfOdd !== 0) ||
		!isGraphConnected(nodes, nodes[0])
	) {
		return [[], []];
	}
	const stack: INode[] = [startNode!];

	while (stack.length > 0) {
		// getting last node from stack
		const curr = stack[stack.length - 1];

		if (curr.connections.length === 0) {
			// if dead end -> go back in stack and push index from stack to path arr
			const elem = stack.pop();
			if (!elem) {
				return [path, stepPath];
			}
			path.push(elem.index);

			// setting dead-end state

			stepPath.push({
				stepType: 'node',
				nodeIndex: curr.index,
				state: 'dead-end',
			});
			stepPath.push({
				stepType: 'edge',
				edgeIndexes: [curr.index, stack[stack.length - 1]?.index],
				state: 'dead-end',
			});
			deadEnds[curr.index - 1] = true;
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

			visited[curr.index - 1] = true;
			stepPath.push({
				stepType: 'node',
				nodeIndex: curr.index,
				state: 'visited',
			});

			stepPath.push({
				stepType: 'edge',
				edgeIndexes: [curr.index, indexOfMin + 1],
				state: 'visited',
			});
			// pushing node with min index to stack
			stack.push(nodes[indexOfMin]);
		}
	}

	return [path, stepPath];
}

import { Dispatch, SetStateAction } from 'react';
import { INode } from '../types';

export default function eulersPath(
	nodes: INode[],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>
): number[] {
	setViewDead([]);
	setViewVisited([]);
	// arrays fo visited and deadends
	const visited = new Array(nodes.length).fill(false);
	const deadEnds = new Array(nodes.length).fill(false);
	// array for result path
	const path: number[] = [];
	// stack with initial node
	const startNode = nodes.find((node) => node.connections.length % 2)!;
	const stack: INode[] = [startNode];

	// loop with a timeout
	let loop = setInterval(() => {
		// getting last node from stack
		const curr = stack[stack.length - 1];

		if (curr.connections.length === 0) {
			// if dead end -> go back in stack and push index from stack to path arr
			const elem = stack.pop()!;
			path.push(elem.index);

			// setting dead-end state
			deadEnds[curr.index - 1] = true;
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
			visited[curr.index - 1] = true;
			setViewVisited([...visited]);
			// pushing node with min index to stack
			stack.push(nodes[indexOfMin]);
		}

		// continue until stack is empty
		if (stack.length === 0) {
			clearInterval(loop);
			console.log(path.reverse());
			return path;
		}
	}, 150);

	return path;
}

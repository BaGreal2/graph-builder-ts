import { Dispatch, SetStateAction } from 'react';
import { INode, IEdge } from '../types';

export default function deepFirstSearch(
	nodes: INode[],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	startNode: INode,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>,
	setShowModal: Dispatch<
		SetStateAction<{
			text: string;
			confirm?: boolean;
		}>
	>
) {
	setViewDead([]);
	setViewVisited([]);

	const visited = new Array(nodes.length).fill(false);
	const deadEnds = new Array(nodes.length).fill(false);
	const stack = [startNode];
	const edgesCopy = [...edges];
	edgesCopy.forEach((edge) => (edge.state = ''));

	// loop with a timeout
	const loop = setInterval(() => {
		// getting last node from stack
		const curr = stack[stack.length - 1];

		// if current node is not visited -> visit and push to stack it's first neighbour
		if (!visited[curr.index - 1]) {
			visited[curr.index - 1] = true;
			setViewVisited([...visited]);
			let foundIndex: number;

			for (const connection of curr.connections) {
				if (!visited[connection[0]! - 1]) {
					stack.push(nodes[connection[0]! - 1]);
					foundIndex = nodes[connection[0]! - 1].index;
					break;
				}
			}
			edgesCopy.map((edge) => {
				if (
					(edge.from === curr.index && edge.to === foundIndex) ||
					(edge.to === curr.index && edge.from === foundIndex)
				) {
					edge.state = 'visited';
				}
			});
			setEdges([...edgesCopy]);
		} else {
			// if all connected edges are visited -> dead end
			if (curr.connections.every((connection) => visited[connection[0]! - 1])) {
				deadEnds[curr.index - 1] = true;
				setViewDead([...deadEnds]);
				stack.pop();
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
				setEdges([...edgesCopy]);
			} else {
				// if there are unvisited neibours -> push to stack first of them
				for (const connection of curr.connections) {
					if (!visited[connection[0]! - 1]) {
						stack.push(nodes[connection[0]! - 1]);
						break;
					}
				}
			}
		}

		// continue until stack is empty
		if (stack.length === 0) {
			clearInterval(loop);
			console.log(deadEnds);
			if (deadEnds.every((end) => end)) {
				setShowModal({ text: 'Connected graph!' });
			} else {
				setShowModal({ text: 'Not connected graph!' });
			}
		}
	}, 150);
}

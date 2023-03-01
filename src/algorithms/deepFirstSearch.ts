import { Dispatch, SetStateAction } from 'react';
import { INode } from '../types';

export default function deepFirstSearch(
	nodes: INode[],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	startNode: INode
) {
	setViewDead([]);
	setViewVisited([]);
	// arrays fo visited and deadends
	const visited = new Array(nodes.length).fill(false);
	const deadEnds = new Array(nodes.length).fill(false);

	// stack with initial node
	const stack = [startNode];

	// loop with a timeout
	function dfsLoop() {
		setTimeout(function () {
			// getting last node from stack
			const curr = stack[stack.length - 1];

			// if current node is not visited -> visit and push to stack it's first neighbour
			if (!visited[curr.index - 1]) {
				visited[curr.index - 1] = true;
				setViewVisited([...visited]);

				for (let connection of curr.connections) {
					if (!visited[connection[0] - 1]) {
						stack.push(nodes[connection[0] - 1]);
						break;
					}
				}
			} else {
				// if all connected edges are visited -> dead end
				if (
					curr.connections.every((connection) => visited[connection[0] - 1])
				) {
					deadEnds[curr.index - 1] = true;
					setViewDead([...deadEnds]);
					stack.pop();
				} else {
					// if there are unvisited neibours -> push to stack first of them
					for (let connection of curr.connections) {
						if (!visited[connection[0] - 1]) {
							stack.push(nodes[connection[0] - 1]);
							break;
						}
					}
				}
			}

			// continue until stack is empty
			if (stack.length > 0) {
				dfsLoop();
			}
		}, 200);
	}

	dfsLoop();
}

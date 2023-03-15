import { Dispatch, SetStateAction } from 'react';
import { IEdge, INode } from '../types';
import sleep from 'sleep-promise';

export default async function depthFirstSearch(
	nodes: INode[],
	visited: boolean[],
	deadEnds: boolean[],
	startNode: INode,
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>,
	speed: number,
	visitedNodes?: number[]
) {
	const stack = [startNode];
	const pathVisited = new Array(nodes.length).fill(false);
	let foundIndexGlobal: number;

	while (stack.length > 0) {
		// getting last node from stack
		const curr = stack[stack.length - 1];

		// if current node is not visited -> visit and push to stack it's first neighbour
		if (!visited[curr.index - 1]) {
			visited[curr.index - 1] = true;
			pathVisited[curr.index - 1] = true;
			setViewVisited([...visited]);

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
			edges.map((edge) => {
				if (
					(edge.from === curr.index && edge.to === foundIndexCurr) ||
					(edge.to === curr.index && edge.from === foundIndexCurr) ||
					(edge.from === curr.index && edge.to === foundIndexGlobal) ||
					(edge.to === curr.index && edge.from === foundIndexGlobal)
				) {
					edge.state = 'visited';
				}
			});
			setEdges([...edges]);
		} else {
			// if all connected edges are visited -> dead end
			if (curr.connections.every((connection) => visited[connection[0] - 1])) {
				deadEnds[curr.index - 1] = true;
				pathVisited[curr.index - 1] = false;
				if (visitedNodes) {
					if (!visitedNodes.includes(curr.index)) {
						visitedNodes.push(curr.index);
					}
				}
				setViewDead([...deadEnds]);
				stack.pop();

				edges.map((edge) => {
					if (
						(edge.from === curr.index &&
							edge.to === stack[stack.length - 1]?.index) ||
						(edge.to === curr.index &&
							edge.from === stack[stack.length - 1]?.index)
					) {
						edge.state = 'dead-end';
					}
				});
				setEdges([...edges]);
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
		await sleep(speed);
	}
}

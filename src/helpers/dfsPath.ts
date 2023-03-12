import { Dispatch, SetStateAction } from 'react';
import { INode, IEdge } from '../types';

export default async function dfsPath(
	nodes: INode[],
	visited: boolean[],
	deadEnds: boolean[],
	visitedNodes: number[],
	startNode: INode,
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>
) {
	const stack = [startNode];
	const pathVisited = new Array(nodes.length).fill(false);

	await intervalLoop(
		nodes,
		stack,
		visited,
		pathVisited,
		deadEnds,
		visitedNodes,
		setViewVisited,
		setViewDead,
		edges,
		setEdges
	);
}

function intervalLoop(
	nodes: INode[],
	stack: INode[],
	visited: boolean[],
	pathVisited: boolean[],
	deadEnds: boolean[],
	visitedNodes: number[],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>
) {
	return new Promise((resolve) => {
		let foundIndexGlobal: number;
		const loop = setInterval(() => {
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
					} else if (pathVisited[connection[0] - 1]) {
						visitedNodes.fill(0);
						clearInterval(loop);
						resolve(loop);
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
				if (
					curr.connections.every((connection) => visited[connection[0] - 1])
				) {
					deadEnds[curr.index - 1] = true;
					pathVisited[curr.index - 1] = false;
					if (!visitedNodes.includes(curr.index)) {
						visitedNodes.push(curr.index);
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
			if (stack.length === 0) {
				clearInterval(loop);
				resolve(loop);
			}
		}, 150);
	});
}

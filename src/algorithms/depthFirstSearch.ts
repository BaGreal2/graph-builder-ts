import { INode, IStep } from '../types';

export default function depthFirstSearch(
	nodes: INode[],
	visited: boolean[],
	deadEnds: boolean[],
	startNode: INode,
	visitedNodes?: number[]
) {
	const stack = [startNode];
	const stepPath: IStep[] = [];
	const pathVisited = new Array(nodes.length).fill(false);
	let foundIndexGlobal: number;

	while (stack.length > 0) {
		// getting last node from stack
		const curr = stack[stack.length - 1];

		// if current node is not visited -> visit and push to stack it's first neighbour
		if (!visited[curr.index - 1]) {
			visited[curr.index - 1] = true;
			pathVisited[curr.index - 1] = true;
			stepPath.push({
				stepType: 'node',
				nodeIndex: curr.index,
				state: 'visited',
			});

			// check: if works
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
			// if all connected edges are visited -> dead end
			if (curr.connections.every((connection) => visited[connection[0] - 1])) {
				deadEnds[curr.index - 1] = true;
				pathVisited[curr.index - 1] = false;
				if (visitedNodes) {
					if (!visitedNodes.includes(curr.index)) {
						visitedNodes.push(curr.index);
					}
				}

				stepPath.push({
					stepType: 'node',
					nodeIndex: curr.index,
					state: 'dead-end',
				});
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
	return stepPath;
}

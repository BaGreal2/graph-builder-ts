import { INode } from '../types';

export default function isGraphConnected(
	nodes: INode[],
	startNode: INode
): boolean {
	const visited = new Array(nodes.length).fill(false);
	const deadEnds = new Array(nodes.length).fill(false);
	const stack = [startNode];
	const reachedNodes: number[] = [];

	while (stack.length > 0) {
		// getting last node from stack
		const curr = stack[stack.length - 1];
		if (!reachedNodes.includes(curr.index)) {
			reachedNodes.push(curr.index);
		}

		// if current node is not visited -> visit and push to stack it's first neighbour
		if (!visited[curr.index - 1]) {
			visited[curr.index - 1] = true;

			for (const connection of curr.connections) {
				if (!visited[connection[0] - 1]) {
					stack.push(nodes[connection[0] - 1]);
					break;
				}
			}
		} else {
			// if all connected edges are visited -> dead end
			if (curr.connections.every((connection) => visited[connection[0] - 1])) {
				deadEnds[curr.index - 1] = true;
				stack.pop();
			} else {
				// if there are unvisited neibours -> push to stack first of them
				for (const connection of curr.connections) {
					if (!visited[connection[0] - 1]) {
						stack.push(nodes[connection[0] - 1]);
						break;
					}
				}
			}
		}
	}
	if (deadEnds.every((end) => end)) {
		return true;
	} else {
		return false;
	}
}

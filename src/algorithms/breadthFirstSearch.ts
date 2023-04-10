import { INode, IStep } from '../types';

export default function breadthFirstSearch(
	nodes: INode[],
	visited: boolean[],
	startNode: INode
) {
	const queue = [startNode];
	// const deadEnds = new Array(nodes.length).fill(false);
	const stepPath: IStep[] = [];

	visited[startNode.index - 1] = true;
	stepPath.push({
		stepType: 'node',
		nodeIndex: startNode.index,
		state: 'visited',
	});

	while (queue.length > 0) {
		const curr = queue.pop();
		for (const connection of curr!.connections) {
			if (!visited[connection[0] - 1]) {
				visited[connection[0] - 1] = true;

				stepPath.push(
					{
						stepType: 'edge',
						edgeIndexes: [curr!.index, connection[0]],
						state: 'visited',
					},
					{
						stepType: 'node',
						nodeIndex: connection[0],
						state: 'visited',
					}
				);

				queue.unshift(nodes[connection[0] - 1]);
			}
		}
	}
	return stepPath;
}

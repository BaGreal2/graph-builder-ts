import { INode, IStep } from '../types';

export default function breadthFirstSearch(
	nodes: INode[],
	visited: boolean[],
	startNode: INode
) {
	const queue = [startNode];
	const stepPath: IStep[] = [];
	const prev: INode[] = new Array(nodes.length);

	visited[startNode.index - 1] = true;
	stepPath.push({
		stepType: 'node',
		nodeIndex: startNode.index,
		state: 'visited',
	});

	while (queue.length > 0) {
		const curr = queue.pop()!;

		for (const connection of curr.connections) {
			if (!visited[connection[0] - 1]) {
				visited[connection[0] - 1] = true;
				prev[connection[0] - 1] = curr;

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

			if (
				curr.connections.every((connectionIn) => visited[connectionIn[0] - 1])
			) {
				if (prev[curr.index - 1]) {
					stepPath.push({
						stepType: 'edge',
						edgeIndexes: [prev[curr.index - 1].index, curr.index],
						state: 'dead-end',
					});
				}
				stepPath.push({
					stepType: 'node',
					nodeIndex: curr.index,
					state: 'dead-end',
				});
			}
		}
	}
	return stepPath;
}

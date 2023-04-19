import PriorityQueue from '../helpers/proiorityQueue';
import { INode, IStep } from '../types';

export default function dijkstra(
	nodes: INode[],
	startNode: INode,
	endNode: INode
): [number[], number, IStep[]] {
	const dist: number[] = new Array(nodes.length).fill(Infinity);
	const prev: number[][] = new Array(nodes.length);
	for (let i = 0; i < nodes.length; i++) {
		prev[i] = [];
	}

	const path: IStep[] = [];

	const priorityQueue = new PriorityQueue<INode>();
	priorityQueue.enqueue(startNode, 0);

	dist[startNode.index - 1] = 0;

	while (priorityQueue.length > 0) {
		const curr = priorityQueue.dequeue().value;

		path.push(
			{
				stepType: 'node',
				nodeIndex: curr.index,
				state: 'visited',
			},
			{
				stepType: 'number',
				nodeIndex: curr.index,
				numberValue: dist[curr.index - 1],
				state: '',
			}
		);

		for (const connection of curr.connections) {
			const currDistance = curr.connections.find((conn) => {
				if (conn[0] === connection[0]) {
					return true;
				}
			})![1];

			if (!currDistance) {
				continue;
			}

			const alt = dist[curr.index - 1] + currDistance;

			if (alt < dist[connection[0] - 1]) {
				dist[connection[0] - 1] = alt;
				priorityQueue.enqueue(
					nodes[connection[0] - 1],
					dist[connection[0] - 1]
				);
				prev[connection[0] - 1] = [...prev[curr.index - 1], curr.index];
			}
		}
	}

	console.log(startNode.index, endNode.index, dist);

	return [
		[...prev[endNode.index - 1], endNode.index],
		dist[endNode.index - 1],
		path,
	];
}

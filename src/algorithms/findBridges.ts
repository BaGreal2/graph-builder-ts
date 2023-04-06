import { Dispatch, SetStateAction } from 'react';
import sleep from 'sleep-promise';
import { IEdge, INode } from '../types';

export default async function findBridges(
	nodes: INode[],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>,
	speed: number,
	setAdditionalNums: Dispatch<SetStateAction<[number | null, number | null][]>>
): Promise<[[number, number][], [number | null, number | null][]]> {
	setViewDead([]);
	setViewVisited([]);
	setAdditionalNums([]);

	const visited = new Array(nodes.length).fill(false);
	const deadEnds = new Array(nodes.length).fill(false);
	const additionalNums = new Array(nodes.length).fill([null, null]);
	const tin = new Array(nodes.length).fill(-1);
	const low = new Array(nodes.length).fill(-1);
	const bridges: [number, number][] = [];
	const timer = { value: 0 };
	const edgesCopy = [...edges];
	edgesCopy.forEach((edge) => (edge.state = ''));

	for (const node of nodes) {
		if (!visited[node.index - 1]) {
			await dfs(
				nodes,
				node,
				visited,
				deadEnds,
				tin,
				low,
				timer,
				bridges,
				setViewVisited,
				setViewDead,
				edgesCopy,
				setEdges,
				speed,
				additionalNums,
				setAdditionalNums
			);
		}
	}
	return [bridges, additionalNums];
}

async function dfs(
	nodes: INode[],
	startNode: INode,
	visited: boolean[],
	deadEnds: boolean[],
	tin: number[],
	low: number[],
	timer: { value: number },
	bridges: [number, number][],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>,
	speed: number,
	additionalNums: [number | null, number | null][],
	setAdditionalNums: Dispatch<SetStateAction<[number | null, number | null][]>>
) {
	const stack: [INode, null | INode][] = [[startNode, null]];
	let foundIndexGlobal: number;

	while (stack.length > 0) {
		const [curr, parent] = stack[stack.length - 1];

		if (!visited[curr.index - 1]) {
			visited[curr.index - 1] = true;
			setViewVisited([...visited]);

			timer.value++;
			tin[curr.index - 1] = timer.value;
			low[curr.index - 1] = timer.value;

			additionalNums[curr.index - 1] = [
				JSON.parse(JSON.stringify(timer.value)),
				null,
			];
			setAdditionalNums(additionalNums.slice());

			let foundIndexCurr: number;

			for (const connection of curr.connections) {
				if (parent !== null) {
					if (connection[0] === parent.index) {
						continue;
					}
				}
				if (!visited[connection[0] - 1]) {
					stack.push([nodes[connection[0] - 1], curr]);
					foundIndexCurr = nodes[connection[0] - 1].index;
					break;
				} else {
					low[curr.index - 1] = Math.min(
						low[curr.index - 1],
						tin[connection[0] - 1]
					);
					additionalNums[curr.index - 1] = [
						JSON.parse(JSON.stringify(additionalNums[curr.index - 1][0])),
						Math.min(low[curr.index - 1], tin[connection[0] - 1]),
					];
					setAdditionalNums(additionalNums.slice());
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
			if (curr.connections.every((connection) => visited[connection[0] - 1])) {
				for (const connection of curr.connections) {
					if (parent !== null) {
						if (connection[0] === parent.index) {
							continue;
						}
					}
					low[curr.index - 1] = Math.min(
						low[curr.index - 1],
						low[connection[0] - 1]
					);
					additionalNums[curr.index - 1] = [
						JSON.parse(JSON.stringify(additionalNums[curr.index - 1][0])),
						Math.min(low[curr.index - 1], low[connection[0] - 1]),
					];
					setAdditionalNums(additionalNums.slice());
					if (low[connection[0] - 1] > tin[curr.index - 1]) {
						bridges.push([curr.index, connection[0]]);
					}
				}

				deadEnds[curr.index - 1] = true;
				setViewDead([...deadEnds]);
				edges.map((edge) => {
					if (
						(edge.from === curr.index &&
							edge.to === stack[stack.length - 1][0].index) ||
						(edge.to === curr.index &&
							edge.from === stack[stack.length - 1][0].index)
					) {
						edge.state = 'dead-end';
					}
				});
				setEdges([...edges]);
				stack.pop();
			} else {
				for (const connection of curr.connections) {
					if (parent !== null) {
						if (connection[0] === parent.index) {
							continue;
						}
					}
					if (!visited[connection[0] - 1]) {
						stack.push([nodes[connection[0] - 1], curr]);
						foundIndexGlobal = curr.index;
						break;
					} else {
						low[curr.index - 1] = Math.min(
							low[curr.index - 1],
							tin[connection[0] - 1]
						);
						additionalNums[curr.index - 1] = [
							JSON.parse(JSON.stringify(additionalNums[curr.index - 1][0])),
							Math.min(low[curr.index - 1], tin[connection[0] - 1]),
						];

						// setAdditionalNums(additionalNums.slice());
					}
				}
			}
		}
		await sleep(speed);
	}
}

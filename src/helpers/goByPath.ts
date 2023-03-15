import { Dispatch, SetStateAction } from 'react';
import sleep from 'sleep-promise';
import { IEdge } from '../types';
export default async function goByPath(
	path: number[],
	length: number,
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>,
	topSort = false,
	speed: number
) {
	setViewDead([]);
	setViewVisited([]);
	const edgesCopy = [...edges];
	edgesCopy.forEach((edge) => (edge.state = ''));
	setEdges([...edgesCopy]);

	const visited = new Array(length).fill(false);
	let i = 0;
	while (i < path.length) {
		visited[path[i] - 1] = true;
		edgesCopy.map((edge) => {
			if (
				(edge.from === path[i] && edge.to === path[i + 1]) ||
				(edge.to === path[i] && edge.from === path[i + 1])
			) {
				edge.state = 'visited';
			}
		});
		if (topSort) {
			edgesCopy.map((edge) => {
				if (edge.from === path[i]) {
					edge.state = 'visited';
				}
			});
		}
		setEdges([...edgesCopy]);
		setViewVisited([...visited]);
		i++;
		await sleep(speed);
	}
}

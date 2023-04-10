import { Dispatch, SetStateAction } from 'react';
import sleep from 'sleep-promise';
import { IEdge, IStep } from '../types';

export default async function drawStepsPath(
	path: IStep[],
	visited: boolean[],
	deadEnds: boolean[],
	setViewVisited: Dispatch<SetStateAction<boolean[]>>,
	setViewDead: Dispatch<SetStateAction<boolean[]>>,
	edges: IEdge[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>,
	speed: number
) {
	for (const step of path) {
		const state = step.state;

		switch (step.stepType) {
			case 'edge': {
				const startIndex = step.edgeIndexes[0];
				const endIndex = step.edgeIndexes[1];
				console.log(startIndex, endIndex);
				edges.map((edge) => {
					if (
						(edge.from === startIndex && edge.to === endIndex) ||
						(edge.to === startIndex && edge.from === endIndex)
					) {
						edge.state = state;
					}
				});
				setEdges([...edges]);
				break;
			}
			case 'node': {
				const nodeIndex = step.nodeIndex - 1;
				if (state === 'visited') {
					visited[nodeIndex] = true;
					setViewVisited([...visited]);
				} else if (state === 'dead-end') {
					deadEnds[nodeIndex] = true;
					setViewDead([...deadEnds]);
				}
				break;
			}
		}
		await sleep(speed);
	}
}

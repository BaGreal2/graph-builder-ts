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
	additionalNums: [number | null, number | null][],
	setAdditionalNums: Dispatch<SetStateAction<[number | null, number | null][]>>,
	speed: number
) {
	const additionalNumsCopy = additionalNums.slice();
	for (const step of path) {
		const state = step.state;

		switch (step.stepType) {
			case 'edge': {
				const startIndex = step.edgeIndexes[0];
				const endIndex = step.edgeIndexes[1];
				edges.map((edge) => {
					if (
						(edge.from === startIndex && edge.to === endIndex) ||
						(edge.to === startIndex && edge.from === endIndex)
					) {
						edge.state = state;
					}
				});
				setEdges([...edges]);
				await sleep(speed);
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
				await sleep(speed);
				break;
			}
			case 'number': {
				const nodeIndex = step.nodeIndex - 1;
				additionalNumsCopy[nodeIndex] = [step.numberValue, null];

				setAdditionalNums([...additionalNumsCopy]);
			}
		}
	}
}

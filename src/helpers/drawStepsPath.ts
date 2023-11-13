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
	for (const step of path) {
		console.log(step);
		const state = step.state;

		switch (step.stepType) {
			case 'edge': {
				const startIndex = step.edgeIndexes[0];
				const endIndex = step.edgeIndexes[1];
				// console.log(!step.oneDirection);
				edges.map((edge) => {
					if (
						(edge.from === startIndex && edge.to === endIndex) ||
						(edge.to === startIndex &&
							edge.from === endIndex &&
							!step.oneDirection)
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
				additionalNums[nodeIndex] = [step.numberValue, null];

				setAdditionalNums([...additionalNums]);
				break;
			}
			case 'numberSecond': {
				const nodeIndex = step.nodeIndex - 1;
				additionalNums[nodeIndex][1] = step.numberValue;

				setAdditionalNums([...additionalNums]);
				break;
			}
		}
	}
}

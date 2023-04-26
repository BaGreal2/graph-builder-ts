import { Dispatch, SetStateAction } from 'react';
import { IEdge, INode } from '../types';
import getConnectorPoints from './getConnectorPoints';

export default function generateEdges(
	nodesArr: INode[],
	setEdges: Dispatch<SetStateAction<IEdge[]>>
) {
	const newEdges: IEdge[] = [];
	nodesArr.map((node) => {
		node.connections.map((connection) => {
			const node1 = node;
			const node2 = nodesArr.find((node) => node.index === connection[0]);
			if (!node2) {
				return;
			}

			let thisType: 'direct' | 'undirect' = 'direct';
			if (
				node2.connections.some((connection) => {
					return connection[0] === node1.index;
				})
			) {
				thisType = 'undirect';
			}

			const newEdge = {
				from: node1.index,
				to: node2.index,
				weight: connection[1],
				points: getConnectorPoints(node1, node2),
				type: thisType,
				state: '' as const,
			};
			newEdges.push(newEdge);
		});
	});
	setEdges(newEdges);
}

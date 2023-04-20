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
			const index1 =
				node1.connections.length > 0 ? node1.connections.length - 1 : 0;
			const index2 =
				node1.connections.length > 0 ? node2.connections.length - 1 : 0;

			let thisType: 'direct' | 'undirect' = 'direct';
			if (
				node2.connections.some((connection) => {
					return connection[0] === node1.index;
				})
			) {
				thisType = 'undirect';
			}

			console.log(connection[1]);

			const newEdge = {
				from: node1.index,
				to: node2.index,
				index1: index1,
				index2: index2,
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

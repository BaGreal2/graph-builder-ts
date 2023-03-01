import { Dispatch, SetStateAction } from 'react';
import { IEdge } from './edge.interface';
import { INode } from './node.interface';

export interface EdgeProps {
	edge: IEdge;
	mode: string;
	edgesColor: string;
	nodes: INode[];
	setNodes: Dispatch<SetStateAction<INode[]>>;
	setEdges: Dispatch<SetStateAction<IEdge[]>>;
}

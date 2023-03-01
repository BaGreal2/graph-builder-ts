import { Dispatch, SetStateAction } from 'react';
import { IEdge } from './edge.interface';
import { INode } from './node.interface';

export interface ToolbarProps {
	nodes: INode[];
	nodesSelected: INode[];
	setNodesSelected: Dispatch<SetStateAction<INode[]>>;
	setNodes: Dispatch<SetStateAction<INode[]>>;
	setEdges: Dispatch<SetStateAction<IEdge[]>>;
	mode: string;
	setMode: Dispatch<SetStateAction<string>>;
	nodesColor: string;
	setNodesColor: Dispatch<SetStateAction<string>>;
	edgesColor: string;
	setEdgesColor: Dispatch<SetStateAction<string>>;
	type: string;
	setType: Dispatch<SetStateAction<string>>;
	setAlgorithm: Dispatch<SetStateAction<string>>;
}

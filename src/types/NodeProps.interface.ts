import { Dispatch, SetStateAction } from 'react';
import { IEdge } from './edge.interface';
import { INode } from './node.interface';

export interface NodeProps {
	node: INode;
	nodesSelected: INode[];
	setNodesSelected: Dispatch<SetStateAction<INode[]>>;
	nodes: INode[];
	setNodes: Dispatch<SetStateAction<INode[]>>;
	setEdges: Dispatch<SetStateAction<IEdge[]>>;
	mode: string;
	nodesColor: string;
	viewVisited: boolean[];
	viewDead: boolean[];
	setViewVisited: Dispatch<SetStateAction<boolean[]>>;
	setViewDead: Dispatch<SetStateAction<boolean[]>>;
	algorithm: string;
}

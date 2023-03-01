import { Dispatch, SetStateAction } from 'react';
import { IEdge } from './edge.interface';
import { INode } from './node.interface';

export interface UploadBtnProps {
	tooltipText: string;
	setNodes: Dispatch<SetStateAction<INode[]>>;
	setEdges: Dispatch<SetStateAction<IEdge[]>>;
	setType: Dispatch<SetStateAction<string>>;
	setFirstClick: Dispatch<SetStateAction<boolean>>;
	active: boolean;
	setNodesColor: Dispatch<SetStateAction<string>>;
	setEdgesColor: Dispatch<SetStateAction<string>>;
	pressed?: boolean;
}

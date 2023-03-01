import { Dispatch, SetStateAction } from 'react';

export interface ColorSelectionProps {
	nodesColor: string;
	edgesColor: string;
	setNodesColor: Dispatch<SetStateAction<string>>;
	setEdgesColor: Dispatch<SetStateAction<string>>;
}

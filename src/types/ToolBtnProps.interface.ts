import { ReactNode } from 'react';

export interface ToolBtnProps {
	onClick: () => void;
	tooltipText: string;
	active: boolean;
	children: ReactNode;
	pressed?: boolean;
}

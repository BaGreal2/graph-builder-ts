import { ReactNode } from 'react';

export interface SaveBtnProps {
	tooltipText: string;
	onShowChoice: () => void;
	children: ReactNode;
}

import { ReactNode } from 'react';
import { SaveIcon } from '../../assets/icons';
import ToolBtn from './ToolBtn';

interface SaveBtnProps {
	tooltipText: string;
	onShowChoice: () => void;
	children: ReactNode;
}

function SaveBtn({ tooltipText, onShowChoice, children }: SaveBtnProps) {
	return (
		<ToolBtn tooltipText={tooltipText} onClick={onShowChoice} active={true}>
			<SaveIcon />
			{children}
		</ToolBtn>
	);
}

export default SaveBtn;

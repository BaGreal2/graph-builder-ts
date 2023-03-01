import { SaveIcon } from '../../assets/icons';
import { SaveBtnProps } from '../../types';
import ToolBtn from './ToolBtn';

function SaveBtn({ tooltipText, onShowChoice, children }: SaveBtnProps) {
	return (
		<ToolBtn tooltipText={tooltipText} onClick={onShowChoice} active={true}>
			<SaveIcon />
			{children}
		</ToolBtn>
	);
}

export default SaveBtn;

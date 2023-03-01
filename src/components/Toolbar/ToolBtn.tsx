import { ToolBtnProps } from '../../types';
import styles from './ToolBtn.module.css';

function ToolBtn({
	onClick,
	tooltipText,
	active,
	children,
	pressed = false,
}: ToolBtnProps) {
	return (
		<div
			className={`${styles.tool} ${active && styles.active} ${
				pressed && styles.pressed
			}`}
			onClick={() => onClick()}
			data-tooltip-content={tooltipText}
			data-tooltip-id="my-tooltip"
			data-tooltip-place="right"
		>
			{children}
		</div>
	);
}
export default ToolBtn;

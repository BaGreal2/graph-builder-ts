import { ReactNode } from 'react';
import styles from './ToolBtn.module.css';

interface ToolBtnProps {
	onClick: () => void;
	tooltipText: string;
	active: boolean;
	children: ReactNode;
	pressed?: boolean;
}

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

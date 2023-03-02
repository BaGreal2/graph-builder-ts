import { Dispatch, SetStateAction } from 'react';
import { IColor } from '../../types';
import styles from './ColorSelection.module.css';

interface ColorSelectionProps {
	nodesColor: IColor;
	edgesColor: IColor;
	setNodesColor: Dispatch<SetStateAction<IColor>>;
	setEdgesColor: Dispatch<SetStateAction<IColor>>;
}

function ColorSelection({
	nodesColor,
	edgesColor,
	setNodesColor,
	setEdgesColor,
}: ColorSelectionProps) {
	return (
		<div className={styles.colorInputWrapper}>
			<input
				className={styles.colorNodesInput}
				type="color"
				onChange={(e) => setNodesColor(e.target.value as IColor)}
				value={nodesColor}
			/>
			<input
				className={styles.colorEdgesInput}
				type="color"
				onChange={(e) => setEdgesColor(e.target.value as IColor)}
				value={edgesColor}
			/>
			<button
				className={styles.defaultColor}
				onClick={() => {
					setNodesColor('#2a507e');
					setEdgesColor('#ffffff');
				}}
			>
				Set Default
			</button>
		</div>
	);
}

export default ColorSelection;

import { ColorSelectionProps } from '../../types';
import styles from './ColorSelection.module.css';

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
				onChange={(e) => setNodesColor(e.target.value)}
				value={nodesColor}
			/>
			<input
				className={styles.colorEdgesInput}
				type="color"
				onChange={(e) => setEdgesColor(e.target.value)}
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

import styles from './Choice.module.css';

interface ChoiceProps {
	choices: { text: string; tooltip?: string; func: () => void }[];
	upper?: boolean;
}

function Choice({ choices, upper = false }: ChoiceProps) {
	return (
		<div
			className={upper ? styles.choiceContainerUpper : styles.choiceContainer}
		>
			{choices.map((choice, idx) => {
				return (
					<div
						key={idx}
						className={styles.choice}
						onClick={() => choice.func()}
						data-tooltip-content={choice.tooltip}
						data-tooltip-id="my-tooltip"
						data-tooltip-place="right"
					>
						{choice.text}
					</div>
				);
			})}
		</div>
	);
}

export default Choice;

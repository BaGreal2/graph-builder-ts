import { Dispatch, SetStateAction } from 'react';

import styles from './Slider.module.css';

interface SliderProps {
	value: number;
	setValue: Dispatch<SetStateAction<number>>;
}

export default function Slider({ value, setValue }: SliderProps) {
	return (
		<div
			className={styles.sliderWrapper}
			data-tooltip-content="Speed regulation"
			data-tooltip-id="my-tooltip"
			data-tooltip-place="right"
		>
			<input
				type="range"
				min="50"
				max="1000"
				step="50"
				value={value}
				onChange={(e) => setValue(Number(e.target.value))}
				className={styles.slider}
			/>
		</div>
	);
}

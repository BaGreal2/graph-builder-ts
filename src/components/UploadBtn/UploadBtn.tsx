import { ChangeEvent } from 'react';
import { UploadIcon } from '../../assets/icons';
import { generateEdges, getRandomInt } from '../../helpers';
import { INode, UploadBtnProps } from '../../types';
import styles from './UploadBtn.module.css';

function UploadBtn({
	tooltipText,
	setNodes,
	setEdges,
	setType,
	setFirstClick,
	active,
	setNodesColor,
	setEdgesColor,
	pressed = false,
}: UploadBtnProps) {
	// loading file
	function onChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			const file = e.target.files![0];
			const isTXT = file.name.includes('.txt');
			const reader = new FileReader();
			reader.onload = isTXT ? onReaderLoadTXT : onReaderLoadJSON;
			reader.readAsText(file);
		}
	}

	// updating states to loaded .txt file
	function onReaderLoadTXT(e: any) {
		const res = JSON.parse(e.target.result);
		// const nodesRaw = res.nodes;
		const nodesRaw = res;
		const nodesNew: INode[] = nodesRaw.map((node: INode, idx: number) => {
			return {
				index: idx + 1,
				x: getRandomInt(200, window.innerWidth - 150),
				y: getRandomInt(150, window.innerHeight - 150),
				radius: 20,
				connections: node,
			};
		});
		// const type = res.type;
		setFirstClick(true);
		// if (type === '') {
		// } else {
		// 	setFirstClick(false);
		// }
		setNodes([...nodesNew]);
		// setType(type);
		setNodesColor('#2a507e');
		setEdgesColor('#ffffff');
		generateEdges(nodesNew, setEdges);
	}

	// updating states to loaded .json file
	function onReaderLoadJSON(e: any) {
		const res = JSON.parse(e.target.result);
		const { type, nodesColor, edgesColor, nodes } = res;
		if (type === '') {
			setFirstClick(true);
		} else {
			setFirstClick(false);
		}
		setNodes([...nodes]);
		setType(type);
		setNodesColor(nodesColor);
		setEdgesColor(edgesColor);
		generateEdges(nodes, setEdges);
	}
	return (
		<div
			className={styles.toolContainer}
			data-tooltip-content={tooltipText}
			data-tooltip-id="my-tooltip"
			data-tooltip-place="right"
		>
			<label
				className={`${styles.tool} ${active && styles.active} ${
					pressed && styles.pressed
				}`}
				htmlFor="upload-file"
			>
				<UploadIcon />
			</label>
			<input
				id="upload-file"
				className={styles.input}
				type={'file'}
				accept={'.json, .txt'}
				onChange={(e) => onChange(e)}
			/>
		</div>
	);
}
export default UploadBtn;

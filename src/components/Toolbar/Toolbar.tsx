import { saveAs } from 'file-saver';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { eulersPath } from '../../algorithms';
import {
	AlgorithmIcon,
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	ConnectionsIcon,
	FillIcon,
	HashIcon,
	LineIcon,
	PointerIcon,
	TrashIcon,
} from '../../assets/icons';
import { generateEdges } from '../../helpers';
import { IAlgorithm, IColor, IEdge, IMode, INode, IType } from '../../types';
import Choice from '../Choice';
import ColorSelection from '../ColorSelection';
import UploadBtn from '../UploadBtn';
import SaveBtn from './SaveBtn';
import styles from './Toolbar.module.css';
import ToolBtn from './ToolBtn';

interface ToolbarProps {
	nodes: INode[];
	nodesSelected: INode[];
	setNodesSelected: Dispatch<SetStateAction<INode[]>>;
	setNodes: Dispatch<SetStateAction<INode[]>>;
	setEdges: Dispatch<SetStateAction<IEdge[]>>;
	mode: IMode;
	setMode: Dispatch<SetStateAction<IMode>>;
	nodesColor: IColor;
	setNodesColor: Dispatch<SetStateAction<IColor>>;
	edgesColor: IColor;
	setEdgesColor: Dispatch<SetStateAction<IColor>>;
	type: IType;
	setType: Dispatch<SetStateAction<IType>>;
	setAlgorithm: Dispatch<SetStateAction<IAlgorithm>>;
	setViewVisited: Dispatch<SetStateAction<boolean[]>>;
	setViewDead: Dispatch<SetStateAction<boolean[]>>;
}

function Toolbar({
	nodes,
	nodesSelected,
	setNodesSelected,
	setNodes,
	setEdges,
	mode,
	setMode,
	nodesColor,
	setNodesColor,
	edgesColor,
	setEdgesColor,
	type,
	setType,
	setAlgorithm,
	setViewVisited,
	setViewDead,
}: ToolbarProps) {
	// setting toolbar states
	const [showChoiceColor, setShowChoiceColor] = useState<boolean>(false);
	const [showChoiceSave, setShowChoiceSave] = useState<boolean>(false);
	const [showAlgorithms, setShowAlgorithms] = useState<boolean>(false);
	const [firstClick, setFirstClick] = useState<boolean>(true);
	// checking if connection button needs to be active
	const connectionActive = nodesSelected.length > 1;
	const typeActive = nodes.some((node) => node.connections.length > 0);

	// connecting selected edges
	function onConnect(type: IType) {
		// showing modal dialog only once
		setFirstClick(false);
		if (firstClick) {
			setShowChoiceColor(true);
			return;
		}
		setShowChoiceColor(false);
		if (type === '') {
			return;
		}

		const nodesCopy = [...nodes];

		for (let i = 0; i < nodesSelected.length - 1; i++) {
			const node1 = nodesSelected[i];
			const node2 = nodesSelected[i + 1];
			if (
				node2.connections.some((connection) => {
					return connection[0] === node1.index;
				}) &&
				!node1.connections.some((connection) => {
					return connection[0] === node2.index;
				})
			) {
				nodesCopy[node1.index - 1].connections.push([
					node2.index,
					node2.connections.find((connection) => {
						return connection[0] === node1.index;
					})![1],
				]);

				continue;
			}

			if (
				node2.connections.some((connection) => {
					return connection[0] === node1.index;
				}) &&
				node1.connections.some((connection) => {
					return connection[0] === node2.index;
				})
			) {
				continue;
			}

			nodesCopy[node1.index - 1].connections.push([node2.index, null]);

			if (type === 'undirect') {
				nodesCopy[node2.index - 1].connections.push([node1.index, null]);
			}
		}

		setNodesSelected([]);
		generateEdges(nodesCopy, setEdges);
		setNodes([...nodesCopy]);
	}

	// connecting directed graph
	function onDirect() {
		setType('direct');
		setShowChoiceColor(false);
		onConnect('direct');
	}

	// connecting undirected graph
	function onUndirect() {
		setType('undirect');
		setShowChoiceColor(false);
		onConnect('undirect');
	}

	// setting algorithm
	function onAlgorithmMode(algorithm: IAlgorithm) {
		if (nodes.length === 0) {
			return;
		}
		setMode('algorithm');
		setAlgorithm(algorithm);
	}

	//save graph to file
	function onSaveGraph(format: string) {
		let saveObj;
		if (format === '.json') {
			saveObj = {
				type,
				nodesColor,
				edgesColor,
				nodes,
			};
		} else {
			const saveNodesArr = nodes.map((node) => node.connections);
			saveObj = saveNodesArr;
		}

		const fileData = JSON.stringify(saveObj);
		let userFileName = prompt('Enter filename:');
		if (!userFileName) {
			userFileName = 'graph';
		}
		const blob = new Blob([fileData], { type: 'text/plain' });
		saveAs(blob, userFileName + format);
	}

	function toggleType() {
		if (type === 'undirect') {
			setType('direct');
		} else {
			setType('undirect');
		}
	}

	function toggleScale() {
		switch (mode) {
			case 'scaleup':
				setMode('scaledown');
				break;
			case 'scaledown':
				setMode('scaleup');
				break;
			default:
				setMode('scaleup');
				break;
		}
	}

	function keyPressHandler({ key }: KeyboardEvent) {
		switch (key) {
			case 'c':
				connectionActive && onConnect(type);
				break;
			case 'w':
				setMode('weight');
				break;
			case 's':
				setMode('create');
				break;
			case 'u':
				toggleScale();
				break;
			case 'f':
				setMode('color');
				break;
			case 'd':
				setMode('delete');
				break;
			case 't':
				typeActive && toggleType();
				break;
			default:
				break;
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', keyPressHandler);

		return () => {
			window.removeEventListener('keydown', keyPressHandler);
		};
	}, [firstClick, showChoiceColor, nodesSelected, type, mode]);

	return (
		<div className={styles.toolbar}>
			<div className={styles.toolsWrapper}>
				<ToolBtn
					onClick={() => setMode('create')}
					tooltipText="Create mode"
					active={true}
					pressed={mode === 'create'}
				>
					<PointerIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => setMode('weight')}
					tooltipText="Weight mode"
					active={true}
					pressed={mode === 'weight'}
				>
					<HashIcon />
				</ToolBtn>
				<ToolBtn
					onClick={toggleScale}
					tooltipText="Scale mode"
					active={true}
					pressed={mode === 'scaleup' || mode === 'scaledown'}
				>
					{mode === 'scaledown' ? <ArrowDownIcon /> : <ArrowUpIcon />}
				</ToolBtn>

				<ToolBtn
					onClick={() => setMode('delete')}
					tooltipText="Delete mode"
					active={true}
					pressed={mode === 'delete'}
				>
					<TrashIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => setMode('color')}
					tooltipText="Color mode"
					active={true}
					pressed={mode === 'color'}
				>
					<FillIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => setShowAlgorithms((prev) => !prev)}
					tooltipText="Algorithms"
					active={true}
					pressed={showAlgorithms}
				>
					<AlgorithmIcon />
					{showAlgorithms && (
						<Choice
							choices={[
								{
									text: 'DFS',
									func: () => onAlgorithmMode('dfs'),
									tooltip: 'Deep First Search',
								},
								{
									text: 'E Path',
									func: () => {
										const nodesCopy = JSON.parse(JSON.stringify(nodes));
										setMode('algorithm');
										eulersPath(nodesCopy, setViewVisited, setViewDead);
									},
									tooltip: `Euler's Path`,
								},
							]}
						/>
					)}
				</ToolBtn>
				<ToolBtn
					onClick={() => connectionActive && onConnect(type)}
					tooltipText="Connect mode"
					active={connectionActive}
				>
					<ConnectionsIcon />
					{showChoiceColor && (
						<Choice
							choices={[
								{
									text: 'Directed',
									func: onDirect,
								},
								{
									text: 'Undirected',
									func: onUndirect,
								},
							]}
						/>
					)}
				</ToolBtn>
				{type !== '' && (
					<ToolBtn
						onClick={toggleType}
						tooltipText={'Change connection type'}
						active={true}
					>
						{type === 'direct' && <ArrowRightIcon />}
						{type === 'undirect' && <LineIcon />}
					</ToolBtn>
				)}
			</div>
			<div className={styles.save}>
				<UploadBtn
					tooltipText="Upload saved graph"
					setNodes={setNodes}
					setEdges={setEdges}
					setNodesColor={setNodesColor}
					setEdgesColor={setEdgesColor}
					setType={setType}
					setFirstClick={setFirstClick}
					active={true}
				/>

				<SaveBtn
					tooltipText="Save graph"
					onShowChoice={() => setShowChoiceSave((prev) => !prev)}
				>
					{showChoiceSave && (
						<Choice
							choices={[
								{
									text: '.json',
									func: () => onSaveGraph('.json'),
									tooltip: 'Save with full settings',
								},
								{
									text: '.txt',
									func: () => onSaveGraph('.txt'),
									tooltip: 'Save only array',
								},
							]}
							upper
						/>
					)}
				</SaveBtn>
			</div>
			{mode === 'color' && (
				<ColorSelection
					edgesColor={edgesColor}
					nodesColor={nodesColor}
					setEdgesColor={setEdgesColor}
					setNodesColor={setNodesColor}
				/>
			)}
		</div>
	);
}

export default Toolbar;

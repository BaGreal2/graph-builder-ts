import { saveAs } from 'file-saver';
import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { eulerianPath, topSort } from '../../algorithms';
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
import {
	AlgorithmValues,
	IColor,
	IEdge,
	INode,
	ModeValues,
	TypeValues,
} from '../../types';
import Choice from '../Choice';
import ColorSelection from '../ColorSelection';
import { ModeContext } from '../ModeProvider';
import UploadBtn from '../UploadBtn';
import SaveBtn from './SaveBtn';
import styles from './Toolbar.module.css';
import ToolBtn from './ToolBtn';

interface ToolbarProps {
	nodes: INode[];
	nodesSelected: INode[];
	setNodesSelected: Dispatch<SetStateAction<INode[]>>;
	setNodes: Dispatch<SetStateAction<INode[]>>;
	edges: IEdge[];
	setEdges: Dispatch<SetStateAction<IEdge[]>>;
	nodesColor: IColor;
	setNodesColor: Dispatch<SetStateAction<IColor>>;
	edgesColor: IColor;
	setEdgesColor: Dispatch<SetStateAction<IColor>>;
	setAlgorithm: Dispatch<SetStateAction<AlgorithmValues>>;
	setViewVisited: Dispatch<SetStateAction<boolean[]>>;
	setViewDead: Dispatch<SetStateAction<boolean[]>>;
	setPath: Dispatch<SetStateAction<number[]>>;
	setShowModal: Dispatch<SetStateAction<{ text: string; confirm?: boolean }>>;
}

function Toolbar({
	nodes,
	nodesSelected,
	setNodesSelected,
	setNodes,
	edges,
	setEdges,
	nodesColor,
	setNodesColor,
	edgesColor,
	setEdgesColor,
	setAlgorithm,
	setViewVisited,
	setViewDead,
	setPath,
	setShowModal,
}: ToolbarProps) {
	// setting toolbar states
	const [showChoiceColor, setShowChoiceColor] = useState<boolean>(false);
	const [showChoiceSave, setShowChoiceSave] = useState<boolean>(false);
	const [showAlgorithms, setShowAlgorithms] = useState<boolean>(false);
	const [firstClick, setFirstClick] = useState<boolean>(true);
	const [type, setType] = useState<TypeValues>(TypeValues.NONE);
	const { mode, setMode } = useContext(ModeContext);
	// checking if connection button needs to be active
	const connectionActive = nodesSelected.length > 1;
	const typeActive = nodes.some((node) => node.connections.length > 0);

	// connecting selected edges
	function onConnect(type: TypeValues) {
		// showing modal dialog only once
		setFirstClick(false);
		if (firstClick) {
			setShowChoiceColor(true);
			return;
		}
		setShowChoiceColor(false);
		if (type === TypeValues.NONE) {
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

			if (type === TypeValues.UNDIRECT) {
				nodesCopy[node2.index - 1].connections.push([node1.index, null]);
			}
		}

		setNodesSelected([]);
		generateEdges(nodesCopy, setEdges);
		setNodes([...nodesCopy]);
	}

	// connecting directed graph
	function onDirect() {
		setType(TypeValues.DIRECT);
		setShowChoiceColor(false);
		onConnect(TypeValues.DIRECT);
	}

	// connecting undirected graph
	function onUndirect() {
		setType(TypeValues.UNDIRECT);
		setShowChoiceColor(false);
		onConnect(TypeValues.UNDIRECT);
	}

	function resetAlgorithmViews() {
		setViewDead([]);
		setViewVisited([]);
		setPath([]);
		setShowModal({ text: '' });
		const edgesCopy = [...edges];
		edgesCopy.forEach((edge) => (edge.state = ''));
		setEdges([...edgesCopy]);
	}

	// setting algorithm
	function onAlgorithmMode(algorithm: AlgorithmValues) {
		if (nodes.length === 0) {
			return;
		}
		resetAlgorithmViews();
		setMode!(ModeValues.ALGORITHM);
		setAlgorithm(algorithm);
	}

	//save graph to file
	function onSaveGraph(format: string) {
		let saveObj;
		if (format === '.json') {
			saveObj = {
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
		if (type === TypeValues.UNDIRECT) {
			setType(TypeValues.DIRECT);
		} else {
			setType(TypeValues.UNDIRECT);
		}
	}

	function toggleScale() {
		switch (mode) {
			case ModeValues.UPSCALE:
				setMode!(ModeValues.DOWNSCALE);
				break;
			case ModeValues.DOWNSCALE:
				setMode!(ModeValues.UPSCALE);
				break;
			default:
				setMode!(ModeValues.UPSCALE);
				break;
		}
	}

	function keyPressHandler({ key }: KeyboardEvent) {
		switch (key) {
			case 'c':
				connectionActive && onConnect(type);
				break;
			case 'w':
				setMode!(ModeValues.WEIGHT);
				break;
			case 's':
				setMode!(ModeValues.CREATE);
				break;
			case 'u':
				toggleScale();
				break;
			case 'f':
				setMode!(ModeValues.COLOR);
				break;
			case 'd':
				setMode!(ModeValues.DELETE);
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
					onClick={() => setMode!(ModeValues.CREATE)}
					tooltipText="Create mode"
					active={true}
					pressed={mode === ModeValues.CREATE}
				>
					<PointerIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => setMode!(ModeValues.WEIGHT)}
					tooltipText="Weight mode"
					active={true}
					pressed={mode === ModeValues.WEIGHT}
				>
					<HashIcon />
				</ToolBtn>
				<ToolBtn
					onClick={toggleScale}
					tooltipText="Scale mode"
					active={true}
					pressed={mode === ModeValues.UPSCALE || mode === ModeValues.DOWNSCALE}
				>
					{mode === ModeValues.DOWNSCALE ? <ArrowDownIcon /> : <ArrowUpIcon />}
				</ToolBtn>

				<ToolBtn
					onClick={() => setMode!(ModeValues.DELETE)}
					tooltipText="Delete mode"
					active={true}
					pressed={mode === ModeValues.DELETE}
				>
					<TrashIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => setMode!(ModeValues.COLOR)}
					tooltipText="Color mode"
					active={true}
					pressed={mode === ModeValues.COLOR}
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
									func: () => onAlgorithmMode(AlgorithmValues.DFS),
									tooltip: 'Depth First Search',
								},
								{
									text: 'E Path',
									func: () => {
										const nodesCopy = JSON.parse(JSON.stringify(nodes));
										setMode!(ModeValues.ALGORITHM);
										onAlgorithmMode(AlgorithmValues.EULERIANPATH);
										eulerianPath(
											nodesCopy,
											setViewVisited,
											setViewDead,
											setPath,
											edges,
											setEdges,
											setShowModal
										);
									},
									tooltip: `Euler's Path`,
								},
								{
									text: 'TopSort',
									func: () => {
										const nodesCopy = JSON.parse(JSON.stringify(nodes));
										setMode!(ModeValues.ALGORITHM);
										onAlgorithmMode(AlgorithmValues.TOPSORT);
										topSort(
											nodesCopy,
											setViewVisited,
											setViewDead,
											setPath,
											setShowModal,
											edges,
											setEdges
										);
									},
									tooltip: `Topological Sort`,
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
				{type !== TypeValues.NONE && (
					<ToolBtn
						onClick={toggleType}
						tooltipText={'Change connection type'}
						active={true}
					>
						{type === TypeValues.DIRECT && <ArrowRightIcon />}
						{type === TypeValues.UNDIRECT && <LineIcon />}
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
					setFirstClick={setFirstClick}
					active={true}
					resetAlgorithmViews={() => resetAlgorithmViews()}
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
			{mode === ModeValues.COLOR && (
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

import { saveAs } from 'file-saver';
import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { eulerianPath, findBridges, topSort } from '../../algorithms';
import kruscal from '../../algorithms/kruscal';
import prims from '../../algorithms/prims';
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
import { drawStepsPath, generateEdges } from '../../helpers';
import {
	AlgorithmValues,
	IColor,
	IEdge,
	INode,
	IStep,
	ModeValues,
	TypeValues,
} from '../../types';
import Choice from '../Choice';
import ColorSelection from '../ColorSelection';
import { ModeContext } from '../ModeProvider';
import Slider from '../Slider';
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
	showModal: { text: string; confirm?: boolean | undefined };
	setShowModal: Dispatch<SetStateAction<{ text: string; confirm?: boolean }>>;
	algorithmSpeed: number;
	setAlgorithmSpeed: Dispatch<SetStateAction<number>>;
	additionalNums: [number | null, number | null][];
	setAdditionalNums: Dispatch<SetStateAction<[number | null, number | null][]>>;
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
	showModal,
	setShowModal,
	algorithmSpeed,
	setAlgorithmSpeed,
	additionalNums,
	setAdditionalNums,
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

	async function onEPath() {
		const nodesCopy = JSON.parse(JSON.stringify(nodes));
		const visited = new Array(nodes.length).fill(false);
		const deadEnds = new Array(nodes.length).fill(false);
		setMode!(ModeValues.ALGORITHM);
		onAlgorithmMode(AlgorithmValues.EULERIANPATH);
		setViewDead([]);
		setViewVisited([]);
		const [ePath, stepPath] = eulerianPath(nodesCopy);

		await drawStepsPath(
			stepPath!,
			visited,
			deadEnds,
			setViewVisited,
			setViewDead,
			edges,
			setEdges,
			[...additionalNums],
			setAdditionalNums,
			algorithmSpeed
		);
		if (ePath.length === 0) {
			setShowModal({ text: 'Not possible to find path!' });
			return;
		}

		setPath([...ePath].reverse());
		let throwText = [...ePath].reverse().toString().split(',').join('-');
		if (ePath[ePath.length - 1] === ePath[0]) {
			throwText += ' cycle!';
		}
		setShowModal({
			text: throwText,
			confirm: true,
		});
	}

	function onTopSort() {
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
			setEdges,
			[...additionalNums],
			setAdditionalNums,
			algorithmSpeed
		);
	}

	async function onBridges() {
		const nodesCopy = JSON.parse(JSON.stringify(nodes));
		setMode!(ModeValues.ALGORITHM);
		onAlgorithmMode(AlgorithmValues.BRIDGES);
		const [bridges, additionalNumsBridges] = await findBridges(
			nodesCopy,
			setViewVisited,
			setViewDead,
			edges,
			setEdges,
			algorithmSpeed,
			setAdditionalNums
		);

		if (bridges.length == 0) {
			setShowModal({
				text: 'No bridges found.',
			});
			return;
		}

		let count = 0;
		const formatedBridges = [...bridges]
			.reverse()
			.toString()
			.replace(/,/g, () => {
				count++;
				return count % 2 === 0 ? ', ' : '-';
			});

		setViewDead([]);
		setViewVisited([]);
		const edgesCopy = [...edges];
		edgesCopy.forEach((edge) => {
			edge.state = '';
			bridges.forEach((bridge) => {
				if (
					(edge.from === bridge[0] && edge.to === bridge[1]) ||
					(edge.from === bridge[1] && edge.to === bridge[0])
				) {
					edge.state = 'visited';
				}
			});
		});
		setEdges([...edgesCopy]);

		const visited = new Array(nodes.length).fill(false);
		additionalNumsBridges.forEach((node, i) => {
			if (node[0] === 1) {
				return;
			}
			if (node[0] === node[1]) {
				visited[i] = true;
			}
		});

		setViewVisited(visited.slice());

		setShowModal({
			text: 'Found bridges: ' + formatedBridges,
		});
	}

	function onDijkstra() {
		setMode!(ModeValues.ALGORITHM);
		onAlgorithmMode(AlgorithmValues.DIJKSTRA);
	}

	async function onKruskal() {
		setMode!(ModeValues.ALGORITHM);
		const edgesCopy = [...edges];
		const minSpanPath: IStep[] = [];
		const visited: boolean[] = Array(nodes.length).fill(false);
		const deadEnds: boolean[] = Array(nodes.length).fill(false);

		// edgesCopy.forEach((edge) => console.log(edge.weight));
		const [allPath, minSpan] = kruscal(nodes, edgesCopy);

		for (const edge of minSpan) {
			minSpanPath.push(
				{ stepType: 'node', state: 'visited', nodeIndex: edge.from },
				{
					stepType: 'edge',
					state: 'visited',
					edgeIndexes: [edge.from, edge.to],
				},
				{ stepType: 'node', state: 'visited', nodeIndex: edge.to }
			);
		}

		await drawStepsPath(
			allPath,
			visited,
			deadEnds,
			setViewVisited,
			setViewDead,
			edges,
			setEdges,
			additionalNums,
			setAdditionalNums,
			algorithmSpeed
		);

		edgesCopy.forEach((edge) => (edge.state = ''));
		setEdges([...edgesCopy]);

		await drawStepsPath(
			minSpanPath,
			visited,
			deadEnds,
			setViewVisited,
			setViewDead,
			edges,
			setEdges,
			additionalNums,
			setAdditionalNums,
			0
		);
	}

	async function onPrims() {
		const minSpanPath = prims([...nodes], [...edges], nodes[0]);
		const visited = Array(nodes.length).fill(false);
		const deadEnds = Array(nodes.length).fill(false);
		console.log(minSpanPath);
		await drawStepsPath(
			minSpanPath,
			visited,
			deadEnds,
			setViewVisited,
			setViewDead,
			edges,
			setEdges,
			additionalNums,
			setAdditionalNums,
			algorithmSpeed
		);
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
									func: async () => {
										await onEPath();
									},
									tooltip: `Eulerian Path`,
								},
								{
									text: 'TopSort',
									func: onTopSort,
									tooltip: `Topological Sort`,
								},
								{
									text: 'Bridges',
									func: async () => {
										await onBridges();
									},
									tooltip: `Find Bridges`,
								},
								{
									text: 'BFS',
									func: () => onAlgorithmMode(AlgorithmValues.BFS),
									tooltip: 'Breadth First Search',
								},
								{
									text: 'Dijkstra',
									func: () => onDijkstra(),
									tooltip: 'Dijkstra',
								},
								{
									text: 'Kruskal',
									func: async () => await onKruskal(),
									tooltip: 'Kruskal Minimum Spanning Tree',
								},
								{
									text: 'Prims',
									func: async () => await onPrims(),
									tooltip: 'Prims Minimum Spanning Tree',
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
				{(showAlgorithms || showModal.confirm) && (
					<Slider value={algorithmSpeed} setValue={setAlgorithmSpeed} />
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

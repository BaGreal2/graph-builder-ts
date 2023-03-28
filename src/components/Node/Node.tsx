import Konva from 'konva';
import { Dispatch, SetStateAction, useContext } from 'react';
import { Circle, Group, Text } from 'react-konva';
import { depthFirstSearch } from '../../algorithms';
import { countColor, generateEdges } from '../../helpers';
import { AlgorithmValues, IEdge, INode, ModeValues } from '../../types';
import { ModeContext } from '../ModeProvider';

interface NodeProps {
	node: INode;
	edges: IEdge[];
	nodesSelected: INode[];
	setNodesSelected: Dispatch<SetStateAction<INode[]>>;
	nodes: INode[];
	setNodes: Dispatch<SetStateAction<INode[]>>;
	setEdges: Dispatch<SetStateAction<IEdge[]>>;
	nodesColor: string;
	viewVisited: boolean[];
	viewDead: boolean[];
	setViewVisited: Dispatch<SetStateAction<boolean[]>>;
	setViewDead: Dispatch<SetStateAction<boolean[]>>;
	algorithm: AlgorithmValues;
	setShowModal: Dispatch<
		SetStateAction<{
			text: string;
			confirm?: boolean;
		}>
	>;
	algorithmSpeed: number;
	additionalNum: [number | null, number | null];
}

function Node({
	node,
	edges,
	nodesSelected,
	setNodesSelected,
	nodes,
	setNodes,
	setEdges,
	nodesColor,
	viewVisited,
	viewDead,
	setViewVisited,
	setViewDead,
	algorithm,
	setShowModal,
	algorithmSpeed,
	additionalNum,
}: NodeProps) {
	// destructing node
	const { index, x, y, radius } = node;
	const { mode } = useContext(ModeContext);
	// setting color diffs
	const selectColorDiff = 0x2a507e - 0xc28547;
	const textColorDiff = 0x2a507e - 0xafcfe4;
	const visitedColorDiff = 0x2a507e - 0xba7245;
	const deadColorDiff = 0x2a507e - 0x4d4d4f;
	// checking if node is selected
	const selected = nodesSelected.includes(node);

	// deciding color depending on state
	let currFill = nodesColor;
	if (selected) {
		currFill = countColor(nodesColor, selectColorDiff);
	}
	if (viewVisited[index - 1]) {
		currFill = countColor(nodesColor, visitedColorDiff);
	}
	if (viewDead[index - 1]) {
		currFill = countColor(nodesColor, deadColorDiff);
	}

	// selecting node
	function onSelect() {
		const nodesCopy = [...nodes];
		const nodesSelectedCopy = [...nodesSelected];

		if (!selected) {
			nodesSelectedCopy.push(node);
		} else {
			nodesSelectedCopy.splice(nodesSelectedCopy.indexOf(node), 1);
		}

		setNodesSelected([...nodesSelectedCopy]);
		setNodes([...nodesCopy]);
	}

	// scaling node
	function onScale(mode: 'up' | 'down') {
		const nodesCopy = [...nodes];
		let delta;
		switch (mode) {
			case 'up':
				delta = 10;
				break;
			case 'down':
				delta = -10;
				break;
			default:
				return;
		}

		const validRad = node.radius + delta >= 20;
		nodesCopy[index - 1].radius += validRad ? delta : 0;

		generateEdges(nodesCopy, setEdges);
		setNodes([...nodesCopy]);
	}

	// deleting node
	function onDelete() {
		const nodesCopy = [...nodes];

		nodesCopy.splice(index - 1, 1);
		nodesCopy.forEach((node) => {
			node.connections = node.connections.filter(
				(connection) => connection[0] !== index
			);
		});
		nodesCopy.forEach((node, idx) => {
			node.index = idx + 1;
			node.connections.forEach((connection) => {
				if (connection[0] >= index) {
					connection[0]--;
				}
			});
		});

		generateEdges(nodesCopy, setEdges);
		setNodes([...nodesCopy]);
	}

	// running current algorithm
	async function onAlgorithm() {
		const nodesCopy = JSON.parse(JSON.stringify(nodes));
		const visited = new Array(nodes.length).fill(false);
		const deadEnds = new Array(nodes.length).fill(false);
		switch (algorithm) {
			case AlgorithmValues.DFS:
				setViewVisited([]);
				setViewDead([]);

				await depthFirstSearch(
					nodesCopy,
					visited,
					deadEnds,
					nodes[index - 1],
					setViewVisited,
					setViewDead,
					edges,
					setEdges,
					algorithmSpeed
				);

				if (deadEnds.every((end) => end)) {
					setShowModal({ text: 'Connected graph!' });
				} else {
					setShowModal({ text: 'Not connected graph!' });
				}
				break;
			default:
				break;
		}
	}

	// onclick depending on mode
	function onClick() {
		switch (mode) {
			case ModeValues.UPSCALE:
				onScale('up');
				break;
			case ModeValues.DOWNSCALE:
				onScale('down');
				break;
			case ModeValues.DELETE:
				onDelete();
				break;
			case ModeValues.ALGORITHM:
				onAlgorithm();
				break;
			default:
				onSelect();
				break;
		}
	}

	// saving x and y on drag
	function onDragMove(e: Konva.KonvaEventObject<MouseEvent>) {
		document.body.style.cursor = 'grabbing';
		const nodesCopy = [...nodes];

		nodesCopy[index - 1].x = e.target.attrs.x;
		nodesCopy[index - 1].y = e.target.attrs.y;

		generateEdges(nodesCopy, setEdges);
		setNodes([...nodesCopy]);
	}

	// setting drag boundaries
	function dragBoundFunc(pos: { x: number; y: number }) {
		const stageWidth = window.innerWidth - 50;
		const stageHeight = window.innerHeight;

		const maxX = stageWidth - radius;
		const maxY = stageHeight - radius;

		const x = Math.max(radius, Math.min(pos.x, maxX));
		const y = Math.max(radius, Math.min(pos.y, maxY));

		return { x, y };
	}

	return (
		<Group
			x={x}
			y={y}
			width={radius * 2}
			height={radius * 2}
			draggable={viewVisited.length === 0 && viewDead.length === 0}
			dragBoundFunc={dragBoundFunc}
			onDragMove={(e) => onDragMove(e)}
			onMouseEnter={() => (document.body.style.cursor = 'grab')}
			onDragEnd={() => (document.body.style.cursor = 'grab')}
			onMouseLeave={() => (document.body.style.cursor = 'default')}
			onPointerClick={() => onClick()}
		>
			<Circle radius={radius} fill={currFill} />
			<Text
				x={index < 10 ? -5.5 : -11}
				y={-7}
				fontSize={20}
				fontStyle="bold"
				fill={countColor(nodesColor, textColorDiff)}
				text={index.toString()}
			/>
			{!!additionalNum && !!additionalNum[0] && (
				<Text
					x={-radius * 2}
					y={-radius}
					fontSize={14}
					fill={countColor(nodesColor, textColorDiff)}
					text={`${additionalNum[0]}/`}
				/>
			)}
			{!!additionalNum && !!additionalNum[1] && (
				<Text
					x={-radius * 2 + 11}
					y={-radius}
					fontSize={14}
					fill={countColor(nodesColor, textColorDiff)}
					text={`${additionalNum[1]}`}
				/>
			)}
		</Group>
	);
}

export default Node;

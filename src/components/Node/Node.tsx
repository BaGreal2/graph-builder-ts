import Konva from 'konva';
import { Dispatch, SetStateAction } from 'react';
import { Circle, Group, Text } from 'react-konva';
import { deepFirstSearch } from '../../algorithms';
import { countColor, generateEdges } from '../../helpers';
import { IAlgorithm, IEdge, IMode, INode } from '../../types';

interface NodeProps {
	node: INode;
	nodesSelected: INode[];
	setNodesSelected: Dispatch<SetStateAction<INode[]>>;
	nodes: INode[];
	setNodes: Dispatch<SetStateAction<INode[]>>;
	setEdges: Dispatch<SetStateAction<IEdge[]>>;
	mode: IMode;
	nodesColor: string;
	viewVisited: boolean[];
	viewDead: boolean[];
	setViewVisited: Dispatch<SetStateAction<boolean[]>>;
	setViewDead: Dispatch<SetStateAction<boolean[]>>;
	algorithm: IAlgorithm;
}

function Node({
	node,
	nodesSelected,
	setNodesSelected,
	nodes,
	setNodes,
	setEdges,
	mode,
	nodesColor,
	viewVisited,
	viewDead,
	setViewVisited,
	setViewDead,
	algorithm,
}: NodeProps) {
	// destructing node
	const { index, x, y, radius } = node;
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
	function onScale(mode: string) {
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
				if (connection[0]! >= index) {
					connection[0]!--;
				}
			});
		});

		generateEdges(nodesCopy, setEdges);
		setNodes([...nodesCopy]);
	}

	// running current algorithm
	function onAlgorithm() {
		switch (algorithm) {
			case 'dfs':
				deepFirstSearch(nodes, setViewVisited, setViewDead, nodes[index - 1]);
		}
	}

	// onclick depending on mode
	function onClick() {
		switch (mode) {
			case 'scaleup':
				onScale('up');
				break;
			case 'scaledown':
				onScale('down');
				break;
			case 'delete':
				onDelete();
				break;
			case 'algorithm':
				onAlgorithm();
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
			draggable
			dragBoundFunc={dragBoundFunc}
			onDragMove={(e) => onDragMove(e)}
			onMouseEnter={() => (document.body.style.cursor = 'grab')}
			onDragEnd={() => (document.body.style.cursor = 'grab')}
			onMouseLeave={() => (document.body.style.cursor = 'default')}
			onClick={() => onClick()}
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
		</Group>
	);
}

export default Node;

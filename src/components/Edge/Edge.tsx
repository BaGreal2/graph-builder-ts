import { Dispatch, SetStateAction, useState, useContext } from 'react';
import { Arrow, Group, Line, Text } from 'react-konva';
import { countColor, generateEdges } from '../../helpers';
import { IEdge, INode, ModeValues } from '../../types';
import { ModeContext } from '../ModeProvider';

interface EdgeProps {
	edge: IEdge;
	edgesColor: string;
	nodes: INode[];
	setNodes: Dispatch<SetStateAction<INode[]>>;
	setEdges: Dispatch<SetStateAction<IEdge[]>>;
}

function Edge({ edge, edgesColor, nodes, setNodes, setEdges }: EdgeProps) {
	// destructing edge
	const { from, to, weight, points, type, state } = edge;
	// setting current weight state
	const [weightCurr, setWeightCurr] = useState<string | null>(
		weight ? weight.toString() : ''
	);
	const { mode } = useContext(ModeContext);

	// weight color diff and setting
	const weightColorDiff = 0xffffff - 0xc28547;
	const visitedColorDiff = 0xffffff - 0xba7245;
	const deadColorDiff = 0xffffff - 0x4d4d4f;
	const weightColor = countColor(edgesColor, weightColorDiff);
	let currFill = edgesColor;
	if (state === 'visited') {
		currFill = countColor(edgesColor, visitedColorDiff);
	}
	if (state === 'dead-end') {
		currFill = countColor(edgesColor, deadColorDiff);
	}
	// deciding wether edge is in select state
	const selectState = mode === ModeValues.WEIGHT || mode === ModeValues.DELETE;

	// adding weight to current edge
	function addWeight() {
		const nodesCopy: INode[] = [...nodes];
		const userWeight = prompt('Enter weight:');
		let weight: number | null = null;

		if (isNaN(Number(userWeight))) {
			alert('Enter a valid number!');
			return;
		}
		if (userWeight !== '') {
			weight = Number(userWeight);
		}

		nodesCopy[from - 1].connections.forEach((connection) => {
			if (connection[0] === to) {
				connection[1] = weight;
			}
		});
		nodesCopy[to - 1].connections.forEach((connection) => {
			if (connection[0] === from) {
				connection[1] = weight;
			}
		});

		setWeightCurr(userWeight);
		setNodes([...nodesCopy]);
	}

	// deleting current edge
	function onDelete() {
		const nodesCopy: INode[] = [...nodes];

		nodesCopy[from - 1].connections = nodesCopy[from - 1].connections.filter(
			(connection) => connection[0] !== from && connection[0] !== to
		);
		nodesCopy[to - 1].connections = nodesCopy[to - 1].connections.filter(
			(connection) => connection[0] !== from && connection[0] !== to
		);

		generateEdges(nodesCopy, setEdges);
		setNodes([...nodesCopy]);
	}

	// onclick depending on mode
	function onClick() {
		switch (mode) {
			case ModeValues.WEIGHT:
				addWeight();
				break;
			case ModeValues.DELETE:
				onDelete();
				break;
			default:
				break;
		}
	}

	return (
		<Group
			width={100}
			height={Math.abs(points[0] - points[2])}
			onMouseEnter={() =>
				(document.body.style.cursor = selectState ? 'pointer' : 'default')
			}
			onMouseLeave={() => (document.body.style.cursor = 'default')}
			onPointerClick={() => onClick()}
		>
			{type === 'undirect' && (
				<Line
					fill={currFill}
					stroke={currFill}
					strokeWidth={selectState ? 5 : 2}
					hitStrokeWidth={35}
					points={points}
				/>
			)}

			{type === 'direct' && (
				<Arrow
					fill={currFill}
					stroke={currFill}
					strokeWidth={selectState ? 5 : 2}
					hitStrokeWidth={35}
					points={points}
				/>
			)}

			{weightCurr !== '' && (
				<Text
					x={(points[0] + points[2]) / 2}
					y={(points[1] + points[3]) / 2}
					fontSize={22}
					fill={weightColor}
					text={weightCurr || ''}
					verticalAlign="middle"
					align="center"
					offset={{ x: 50, y: 50 }}
					width={100}
					height={100}
				/>
			)}
		</Group>
	);
}

export default Edge;

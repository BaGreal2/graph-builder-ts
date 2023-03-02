import { Dispatch, SetStateAction, useState } from 'react';
import { Arrow, Group, Line, Text } from 'react-konva';
import { countColor, generateEdges } from '../../helpers';
import { IEdge, IMode, INode } from '../../types';

interface EdgeProps {
	edge: IEdge;
	mode: IMode;
	edgesColor: string;
	nodes: INode[];
	setNodes: Dispatch<SetStateAction<INode[]>>;
	setEdges: Dispatch<SetStateAction<IEdge[]>>;
}

function Edge({
	edge,
	mode,
	edgesColor,
	nodes,
	setNodes,
	setEdges,
}: EdgeProps) {
	// destructing edge
	const { from, to, index1, index2, weight, points, type } = edge;
	// setting current weight state
	const [weightCurr, setWeightCurr] = useState<string | null>(
		weight ? weight.toString() : ''
	);
	// weight color diff and setting
	const weightColorDiff = 0xffffff - 0xc28547;
	const weightColor = countColor(edgesColor, weightColorDiff);
	// deciding wether edge is in select state
	const selectState = mode === 'weight' || mode === 'delete';

	// adding weight to current edge
	function addWeight() {
		const nodesCopy: INode[] = [...nodes];
		const userWeight = prompt('Enter weight:');
		let weight = null;

		if (isNaN(Number(userWeight))) {
			alert('Enter a valid number!');
			return;
		}
		if (userWeight !== '') {
			weight = Number(userWeight);
		}

		nodesCopy[from - 1].connections[index1 - 1][1] = weight;

		if (
			nodesCopy[to - 1].connections[index2 - 1] &&
			nodesCopy[to - 1].connections[index2 - 1][0] === from
		) {
			nodesCopy[to - 1].connections[index2 - 1][1] = weight;
		}

		setWeightCurr(userWeight);
		setNodes([...nodesCopy]);
	}

	// deleting current edge
	function onDelete() {
		const nodesCopy: INode[] = [...nodes];

		nodesCopy[from - 1].connections = nodesCopy[from - 1].connections.filter(
			(connection: (number | null)[]) =>
				connection[0] !== from && connection[0] !== to
		);
		nodesCopy[to - 1].connections = nodesCopy[to - 1].connections.filter(
			(connection: (number | null)[]) =>
				connection[0] !== from && connection[0] !== to
		);

		generateEdges(nodesCopy, setEdges);
		setNodes([...nodesCopy]);
	}

	// onclick depending on mode
	function onClick() {
		switch (mode) {
			case 'weight':
				addWeight();
				break;
			case 'delete':
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
					fill={edgesColor}
					stroke={edgesColor}
					strokeWidth={selectState ? 5 : 2}
					hitStrokeWidth={35}
					points={points}
				/>
			)}

			{type === 'direct' && (
				<Arrow
					fill={edgesColor}
					stroke={edgesColor}
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

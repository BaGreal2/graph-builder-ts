import { useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Edge from './components/Edge';
import Node from './components/Node';
import Toolbar from './components/Toolbar';
import { IAlgorithm, IColor, IEdge, IMode, INode, IType } from './types';

function App() {
	// setting main variables
	const [nodes, setNodes] = useState<INode[]>([]);
	const [edges, setEdges] = useState<IEdge[]>([]);
	const [nodesSelected, setNodesSelected] = useState<INode[]>([]);
	// modes states
	const [mode, setMode] = useState<IMode>('create');
	const [algorithm, setAlgorithm] = useState<IAlgorithm>('');
	// color states
	const [nodesColor, setNodesColor] = useState<IColor>('#2a507e');
	const [edgesColor, setEdgesColor] = useState<IColor>('#ffffff');
	// graph type
	const [type, setType] = useState<IType>('');
	// algorithm variables
	const [viewVisited, setViewVisited] = useState<boolean[]>([]);
	const [viewDead, setViewDead] = useState<boolean[]>([]);

	// creating node on field click
	function onCreateNode(e: MouseEvent) {
		setViewVisited([]);
		setViewDead([]);
		// checkng if node exist on click spot or other mods enabled
		if (
			nodes.some((node) => {
				return (
					e.offsetX > node.x - node.radius &&
					e.offsetX < node.x + node.radius &&
					e.offsetY > node.y - node.radius &&
					e.offsetY < node.y + node.radius
				);
			}) &&
			mode === 'create'
		) {
			return;
		}
		setNodes((prev) => [
			...prev,
			{
				index: nodes.length + 1,
				x: e.offsetX,
				y: e.offsetY,
				radius: 20,
				connections: [],
			},
		]);
	}

	return (
		<div className="app">
			<Toolbar
				nodes={nodes}
				nodesSelected={nodesSelected}
				setNodesSelected={setNodesSelected}
				setNodes={setNodes}
				setEdges={setEdges}
				mode={mode}
				setMode={setMode}
				nodesColor={nodesColor}
				setNodesColor={setNodesColor}
				edgesColor={edgesColor}
				setEdgesColor={setEdgesColor}
				type={type}
				setType={setType}
				setAlgorithm={setAlgorithm}
				setViewVisited={setViewVisited}
				setViewDead={setViewDead}
			/>
			<Stage
				width={window.innerWidth - 50}
				height={window.innerHeight}
				className="stage"
				onClick={(e) => mode === 'create' && onCreateNode(e.evt)}
			>
				<Layer>
					{edges.map((edge, id) => {
						return (
							<Edge
								key={id}
								edge={edge}
								mode={mode}
								edgesColor={edgesColor}
								nodes={nodes}
								setNodes={setNodes}
								setEdges={setEdges}
							/>
						);
					})}
					{nodes.map((node, id) => {
						return (
							<Node
								key={id}
								node={node}
								nodesSelected={nodesSelected}
								setNodesSelected={setNodesSelected}
								nodes={nodes}
								setNodes={setNodes}
								setEdges={setEdges}
								mode={mode}
								nodesColor={nodesColor}
								viewVisited={viewVisited}
								viewDead={viewDead}
								setViewVisited={setViewVisited}
								setViewDead={setViewDead}
								algorithm={algorithm}
							/>
						);
					})}
				</Layer>
			</Stage>
			<Tooltip id="my-tooltip" className="tooltip" />
		</div>
	);
}

export default App;

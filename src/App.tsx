import { useContext, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Edge from './components/Edge';
import Modal from './components/Modal';
import { ModeContext } from './components/ModeProvider';
import Node from './components/Node';
import Toolbar from './components/Toolbar';
import { goByPath } from './helpers';
import { AlgorithmValues, IColor, IEdge, INode, ModeValues } from './types';

function App() {
	// setting main variables
	const [nodes, setNodes] = useState<INode[]>([]);
	const [edges, setEdges] = useState<IEdge[]>([]);
	const [nodesSelected, setNodesSelected] = useState<INode[]>([]);
	// modes states
	const { mode } = useContext(ModeContext);
	const [algorithm, setAlgorithm] = useState<AlgorithmValues>(
		AlgorithmValues.NONE
	);
	// color states
	const [nodesColor, setNodesColor] = useState<IColor>('#2a507e');
	const [edgesColor, setEdgesColor] = useState<IColor>('#ffffff');
	// algorithm variables
	const [viewVisited, setViewVisited] = useState<boolean[]>([]);
	const [viewDead, setViewDead] = useState<boolean[]>([]);
	const [path, setPath] = useState<number[]>([]);
	const [showModal, setShowModal] = useState<{
		text: string;
		confirm?: boolean;
	}>({ text: '' });
	const [algorithmSpeed, setAlgorithmSpeed] = useState<number>(150);

	// creating node on field click
	function onCreateNode(e: MouseEvent) {
		setViewVisited([]);
		setViewDead([]);
		setShowModal({ text: '' });
		// checkng if node exist on click spot or other mods enabled
		if (
			nodes.some((node) => {
				return (
					e.offsetX > node.x - node.radius &&
					e.offsetX < node.x + node.radius &&
					e.offsetY > node.y - node.radius &&
					e.offsetY < node.y + node.radius
				);
			})
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

	function onModalClose() {
		setShowModal({ text: '' });
		setViewDead([]);
		setViewVisited([]);
		setPath([]);
		const edgesCopy = [...edges];
		edgesCopy.map((edge) => (edge.state = ''));
		setEdges([...edgesCopy]);
	}

	return (
		<div className="app">
			{showModal.text.length > 0 &&
				(showModal.confirm ? (
					<Modal
						text={showModal.text}
						onModalClose={() => onModalClose()}
						confirmText="Show Path"
						onConfirm={() => {
							goByPath(
								path,
								nodes.length,
								setViewVisited,
								setViewDead,
								edges,
								setEdges,
								algorithm === AlgorithmValues.TOPSORT,
								algorithmSpeed
							);
						}}
					/>
				) : (
					<Modal text={showModal.text} onModalClose={() => onModalClose()} />
				))}
			<Toolbar
				nodes={nodes}
				nodesSelected={nodesSelected}
				setNodesSelected={setNodesSelected}
				setNodes={setNodes}
				edges={edges}
				setEdges={setEdges}
				nodesColor={nodesColor}
				setNodesColor={setNodesColor}
				edgesColor={edgesColor}
				setEdgesColor={setEdgesColor}
				setAlgorithm={setAlgorithm}
				setViewVisited={setViewVisited}
				setViewDead={setViewDead}
				setPath={setPath}
				showModal={showModal}
				setShowModal={setShowModal}
				algorithmSpeed={algorithmSpeed}
				setAlgorithmSpeed={setAlgorithmSpeed}
			/>
			<Stage
				width={window.innerWidth - 50}
				height={window.innerHeight}
				className="stage"
				onClick={(e) => mode === ModeValues.CREATE && onCreateNode(e.evt)}
			>
				<Layer>
					{edges.map((edge, id) => {
						return (
							<Edge
								key={id}
								edge={edge}
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
								edges={edges}
								nodesSelected={nodesSelected}
								setNodesSelected={setNodesSelected}
								nodes={nodes}
								setNodes={setNodes}
								setEdges={setEdges}
								nodesColor={nodesColor}
								viewVisited={viewVisited}
								viewDead={viewDead}
								setViewVisited={setViewVisited}
								setViewDead={setViewDead}
								algorithm={algorithm}
								setShowModal={setShowModal}
								algorithmSpeed={algorithmSpeed}
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

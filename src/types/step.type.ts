type StepType = 'node' | 'edge';

type StepMap = {
	node: {
		nodeIndex: number;
		state: '' | 'visited' | 'dead-end';
	};
	edge: {
		edgeIndexes: [number, number];
		state: '' | 'visited' | 'dead-end';
	};
};

export type IStep = {
	[K in StepType]: {
		stepType: K;
	} & StepMap[K];
}[StepType];

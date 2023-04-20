type StepType = 'node' | 'number' | 'numberSecond' | 'edge';

type StepMap = {
	node: {
		nodeIndex: number;
		state: '' | 'visited' | 'dead-end';
	};
	number: {
		nodeIndex: number;
		numberValue: number;
		state: '';
	};
	numberSecond: {
		nodeIndex: number;
		numberValue: number;
		state: '';
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

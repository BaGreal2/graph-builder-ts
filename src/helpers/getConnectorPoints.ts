import { INode } from '../types';

export default function getConnectorPoints(from: INode, to: INode) {
	const fromX = from.x;
	const fromY = from.y;
	const toX = to.x;
	const toY = to.y;
	const dx = toX - fromX;
	const dy = toY - fromY;
	const radiusFrom = from.radius;
	const radiusTo = to.radius;
	const angle = Math.atan2(-dy, dx);

	return [
		fromX + -radiusFrom * Math.cos(angle + Math.PI),
		fromY + radiusFrom * Math.sin(angle + Math.PI),
		toX + -radiusTo * Math.cos(angle),
		toY + radiusTo * Math.sin(angle),
	];
}

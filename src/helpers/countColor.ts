export default function countColor(color: string, diff: number) {
	return (
		'#' + Math.abs(parseInt(color.substring(1), 16) - diff).toString(16)
	).substring(0, 7);
}

import { GjkState } from '$lib/gjk';

const labels = ['Support Point', 'Simplex'];
const colors = ['rgba(6, 214, 160, 1)', 'rgba(255, 209, 102, 1)'];
const showLine = [false, true];

export function generateSubstateConfig(index: number, currentState: GjkState) {
	const subStates = [[currentState.support], currentState.simplex.getDrawable()];
	const subStateConfig = {
		label: labels[index],
		data: subStates[index],
		backgroundColor: colors[index],
		borderColor: colors[index],
		showLine: showLine[index]
	};
	return subStateConfig;
}

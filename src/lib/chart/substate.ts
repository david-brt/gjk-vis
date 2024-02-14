import { GjkState } from '$lib/gjk';

export function generateSubstateConfig(index: number, currentState: GjkState) {
	const subStates = [currentState.support, currentState.simplex];
	const subStateConfig = {
		label: labels[index],
		data: subStates[index],
		backgroundColor: colors[index],
		borderColor: colors[index],
		borderWidth: 1
	};
	return subStateConfig;
}

const labels = ['Support Point', 'Simplex'];
const colors = ['rgba(6, 214, 160, 1)', 'rgba(255, 209, 102, 1)'];

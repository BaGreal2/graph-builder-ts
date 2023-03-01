export interface ChoiceProps {
	choices: { text: string; tooltip?: string; func: () => void }[];
	upper?: boolean;
}

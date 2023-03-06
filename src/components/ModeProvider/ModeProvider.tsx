import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from 'react';
import { ModeValues } from '../../types';

interface IModeContext {
	mode: ModeValues;
	setMode?: Dispatch<SetStateAction<ModeValues>>;
}

export const ModeContext = createContext<IModeContext>({
	mode: ModeValues.CREATE,
});

export default function ModeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<ModeValues>(ModeValues.CREATE);

	const value = {
		mode,
		setMode,
	};

	return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

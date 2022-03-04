
import { ParserState } from './state';

export interface Parser<T> {
	(state: ParserState) : T;
}

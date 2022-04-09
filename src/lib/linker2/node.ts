
import { PositionRange } from './pos';

export interface SchemaNode {
	readonly type: string;
	readonly pos: PositionRange;
}


import { Schema } from '../schema';

export interface LinkerOptions {
	resolve_import?(path: string, from: Schema) : Promise<Schema>;
}

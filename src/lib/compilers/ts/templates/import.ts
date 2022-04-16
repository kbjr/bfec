
export interface ImportTemplateOpts {
	type_name: string;
	alias_name?: string;
	from_path: string;
	source_path: string;
}

export const import_template = (tmpl: ImportTemplateOpts) => `
import { ${tmpl.type_name}${tmpl.alias_name ? ` as ${tmpl.alias_name}` : ''} } from '${path(tmpl)}';`;

export const import_utils = (from_path: string, imports: string) => `
import ${imports} from '${path_relative_to(from_path, 'utils')}';`;

export const import_type_expr_template = (tmpl: ImportTemplateOpts) => `typeof import('${path(tmpl)}').${tmpl.type_name}`;

function path(tmpl: ImportTemplateOpts) {
	return path_relative_to(tmpl.from_path, tmpl.source_path);
}

export function path_relative_to(from_path: string, to_path: string) {
	const to_parts = to_path.split('/');
	const from_parts = from_path.split('/');

	// Assume the last portion of the `from_path` is the file name, skip it
	// 
	// Before:
	//     from = "foo/bar/baz/file.ts"
	// 
	// After:
	//     from = "foo/bar/baz"
	// 
	from_parts.pop();

	// Find the closest shared ancestor of each path and remove it from
	// both paths, leaving only the unique portions
	// 
	// Before:
	//     from = "foo/bar/baz"
	//     to = "foo/bar/qux/other.ts"
	// 
	// After:
	//     from = "baz"
	//     to = "qux/other.ts"
	// 
	while (to_parts.length && from_parts.length) {
		if (to_parts[0] === from_parts[0]) {
			to_parts.shift();
			from_parts.shift();
		}

		else {
			break;
		}
	}

	const relative_parts: string[] = [ ];

	if (from_parts.length) {
		// Step up from the `from_path` to the shared ancestor
		// 
		// Before:
		//     from = "baz"
		//     relative = ""
		// 
		// After:
		//     from = ""
		//     relative = ".."
		// 
		while (from_parts.length) {
			from_parts.pop();
			relative_parts.push('..');
		}
	}

	else {
		relative_parts.push('.');
	}

	// Step down from the shared ancestor to the `to_path`
	// 
	// Before:
	//     to = "qux/other.ts"
	//     relative = ".."
	// 
	// After:
	//     to = ""
	//     relative = "../qux/other.ts"
	// 
	while (to_parts.length) {
		relative_parts.push(to_parts.shift());
	}

	return relative_parts.join('/');
}

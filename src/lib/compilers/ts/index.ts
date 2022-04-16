
import { ast } from '../../parser';
import * as lnk from '../../linker';
import * as tmpl from './templates';
import * as ts from './ts-entities';
import { c_ts as log } from '../../log';
import { WriteableDir } from '../../writeable-dir';
import { CompilerState } from './state';

export interface TypescriptCompilerOptions {
	out_dir: WriteableDir;
	root_struct_name: string;
	no_generator_comment?: boolean;
}

type Type = lnk.Struct | lnk.Switch | lnk.Enum;

export async function compile_to_typescript(schema: lnk.Schema, opts: TypescriptCompilerOptions) {
	log.silly('Compiling schema to typescript', schema.source);

	const state = new CompilerState(schema, opts);
	state.root_struct = schema.root_struct;
	state.root_class_name = opts.root_struct_name;
	state.root_class_dir = out_dir_name(schema);

	await write_core_files(state, schema_namespace(schema));

	const collected = collect_types(schema);
	
	if (collected.result.length) {
		const emit_promises: Promise<void>[] = [ ];

		// Build classes for TS representations of each type
		for (const { type, schema } of collected.result) {
			log.debug('Processing collected type', type.name);
			log.silly('Processing collected type', type);

			const dir = out_dir_name(schema);

			switch (type.type) {
				case 'struct': {;
					// TODO: Variants
					const name = type === schema.root_struct ? opts.root_struct_name : type.name;
					const ent = new ts.Struct(dir, name, type, state);
					state.ts_structs.set(type, ent);
					break;
				}

				case 'switch': {
					const ent = new ts.Switch(dir, type.name, type, state);
					state.ts_switches.set(type, ent);
					break;
				}

				case 'enum': {
					const ent = new ts.Enum(dir, type.name, type, state);
					state.ts_enums.set(type, ent);
					break;
				}
			}

			log.debug('Done processing collected type', type.name);
		}
		
		log.debug('Waiting for all {type}.ts files to be emitted...');
		await state.emit_all();
		log.debug('All {type}.ts files written');

		const exports: tmpl.ExportTemplateOpts[] = [
			// TODO: exported types
		];

		for (const [schema, types] of collected.schema_map) {
			const out_dir = out_dir_name(schema);

			await write_schema_index(state, out_dir,
				types.map((type) => {
					const name = (type.type === 'struct' && type.name === '$')
						? opts.root_struct_name
						: type.name;
	
					return { type_name: name, file_name: name };
				})
			);

			const name = schema_namespace(schema);

			exports.push({
				ns_name: name,
				from_path: 'types/$index',
				source_path: out_dir + '/$index'
			});
		}

		await write_type_index(state, exports);
	}

	return state.errors;
}



// ===== Collect Types =====

interface Collector {
	type_set: Set<Type>;
	schema_map: Map<lnk.Schema, Type[]>;
	result: {
		type: Type;
		schema: lnk.Schema;
	}[];
}

function collect_types(schema: lnk.Schema) {
	if (! schema.root_struct) {
		throw new Error('Expected to find a root struct');
	}

	const collector: Collector = {
		type_set: new Set(),
		schema_map: new Map(),
		result: [ ]
	};

	collect(collector, schema.root_struct);
	collect_types_from_struct(collector, schema.root_struct);

	return collector;
}

function collect(types: Collector, node: Type) {
	if (types.type_set.has(node)) {
		return;
	}

	const schema = schema_of(node);
	const schema_types = schema_types_for(types, schema);

	types.type_set.add(node);
	schema_types.push(node);
	types.result.push({
		type: node,
		schema: schema
	});

	collect_types_from(types, node);
}

function schema_of(node: Type) : lnk.Schema {
	switch (node.type) {
		case 'enum':
			return node.parent;

		case 'switch':
			return node.switch_type === 'inline' ? schema_of(node.parent) : node.parent;

		case 'struct':
			let parent = node.parent;

			while (! (parent instanceof lnk.Schema)) {
				parent = parent.parent;

				if (! parent) {
					log.error('Expected to find a parent schema of a struct');
					return null;
				}
			}

			return parent;
	}
}

function schema_types_for(types: Collector, schema: lnk.Schema) {
	if (types.schema_map.has(schema)) {
		return types.schema_map.get(schema);
	}

	const list: Type[] = [ ];
	types.schema_map.set(schema, list);
	return list;
}

function collect_types_from(types: Collector, node: Type) {
	switch (node.type) {
		case 'struct':
			collect_types_from_struct(types, node);
			break;

		case 'switch':
			collect_types_from_switch(types, node);
			break;

		case 'enum':
			collect_types_from_enum(types, node);
			break;
	}
}

function collect_types_from_struct(types: Collector, node: lnk.Struct) {
	if (node.params) {
		for (const param of node.params) {
			const { param_type } = param;
	
			if (param_type.type === 'enum_ref') {
				collect(types, param_type.points_to);
			}
		}
	}

	for (const field of node.fields) {
		if (field.type === 'struct_field') {
			collect_field_type(types, field.field_type);
		}

		else if (field.type === 'struct_expansion') {
			collect_field_type(types, field.expanded_type);
		}
	}
}

function collect_types_from_switch(types: Collector, node: lnk.Switch) {
	// TODO: Step down to any referenced types
}

function collect_types_from_enum(types: Collector, node: lnk.Enum) {
	// pass
}

function collect_field_type(types: Collector, node: lnk.FieldType) {
	switch (node.type) {
		case 'struct_ref':
		case 'switch_ref':
		case 'enum_ref':
			collect(types, node.points_to);
			break;

		case 'type_array':
			collect_field_type(types, node.elem_type);
			break;

		case 'type_refinement':
			switch (node.refined_type.type) {
				case 'struct_ref':
				case 'switch_ref':
					collect(types, node.refined_type.points_to);
					break;

				case 'struct':
				case 'switch':
					collect_types_from(types, node.refined_type);
					break;
			}
			break;
	}
}



// ===== Code Generation =====

async function write_core_files(state: CompilerState, root_schema_ns: string) {
	log.debug('Emiting code/utility files');
	const generator_comment = tmpl.generator_comment_template(state.opts.no_generator_comment);
	
	const entrypoint_ts
		= generator_comment
		+ tmpl.entrypoint_template({
			root_ns_name: root_schema_ns,
			root_struct_class: state.opts.root_struct_name
		});

	const buffer_reader_ts
		= generator_comment
		+ tmpl.buffer_reader_template();

	const buffer_writer_ts
		= generator_comment
		+ tmpl.buffer_writer_template();

	const state_ts
		= generator_comment
		+ tmpl.state_template();

	const unprocessed_slice_ts
		= generator_comment
		+ tmpl.unprocessed_slice_template();

	const utils_ts
		= generator_comment
		+ tmpl.utils_template({
			root_ns_name: root_schema_ns,
			root_struct_class: state.opts.root_struct_name
		});

	log.debug('Waiting for all code/utility files to emit....');

	await Promise.all([
		state.opts.out_dir.write_file('index.ts', entrypoint_ts),
		state.opts.out_dir.write_file('buffer-reader.ts', buffer_reader_ts),
		state.opts.out_dir.write_file('buffer-writer.ts', buffer_writer_ts),
		state.opts.out_dir.write_file('state.ts', state_ts),
		state.opts.out_dir.write_file('unprocessed-slice.ts', unprocessed_slice_ts),
		state.opts.out_dir.write_file('utils.ts', utils_ts),
	]);

	log.debug('All code/utility files done');
}

function write_type_index(state: CompilerState, exports: tmpl.ExportTemplateOpts[]) {
	const generator_comment = tmpl.generator_comment_template(state.opts.no_generator_comment);
	
	const types_index_ts
		= generator_comment
		+ tmpl.types_index_template({ exports });

	return state.opts.out_dir.write_file('types/$index.ts', types_index_ts);
}

function write_schema_index(state: CompilerState, out_dir: string, exports: tmpl.SchemaExportTemplateOpts[]) {
	const generator_comment = tmpl.generator_comment_template(state.opts.no_generator_comment);
	
	const types_index_ts
		= generator_comment
		+ tmpl.schema_index_template({
			exports: exports
		});

	return state.opts.out_dir.write_file(`${out_dir}/$index.ts`, types_index_ts);
}

function out_dir_name(schema: lnk.Schema) {
	let { source } = schema.source;

	if (source.endsWith('.bfec')) {
		source = source.slice(0, -5);
	}

	if (source.startsWith('~/')) {
		return `types/${source.slice(2)}`;
	}

	if (source.startsWith('http://') || source.startsWith('https://')) {
		const parsed = new URL(source);
		return `types/$remote/${parsed.protocol}/${parsed.host}/${parsed.pathname.slice(1)}`;
	}
}

function schema_namespace(schema: lnk.Schema) {
	let { source } = schema.source;

	if (source.endsWith('.bfec')) {
		source = source.slice(0, -5);
	}

	if (source.startsWith('~/')) {
		return source.slice(2).replace(/\//g, '_');
	}

	if (source.startsWith('http://') || source.startsWith('https://')) {
		const parsed = new URL(source);
		// TODO: namespace names for remotes
		// return `types/$remote/${parsed.protocol}/${parsed.host}/${parsed.pathname.slice(1)}`;
		throw new Error('schema_namespace(): no remote namespace names yet');
	}
}

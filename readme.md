
`bfec` - Binary Format Encoder Compiler

Compiles the [bfec schema language](https://github.com/kbjr/bfec/wiki/Grammar) into various output formats, including fully functional encoder/decoder libraries.

The schema language can be used to describe existing binary file formats or for designing entirely new formats. For an example, here's [a schema for the PNG image format](./examples/png/).

#### Output Types:

- TypeScript
- AssemblyScript
- HTML Documentation
- Markdown Documentation
- More to be added over time ....

## Building / Running From Source

```bash
# In project directory...
$ npm i
$ npm run build

# Once built, can be called locally:
$ ./bin/bfec -h
```

## Installing From NPM

```bash
$ npm i -g bfec
```

## Schema Language Grammar

See the wiki

- GitHub: https://github.com/kbjr/bfec/wiki/Grammar

## CLI Usage

```
λ bfec -h

bfec: Binary Format Encoder Compiler
Version 0.1.0

Usage:

  bfec -in <dir> <file> { -out <format> <dir> } [ OPTIONS ]
  bfec -conf <conf_file> [ OPTIONS ]


Input:

  -in <dir> <file>

  <dir>
    The root input directory; All local schema files included must be under
    this directory.

  <file>
    The entrypoint file that contains the root "$" schema definition, relative
    to the root directory.


Outputs:

  { -out <format> <dir> }

  <format>
    The output format to be generated, one of the following:

      "as"        = AssemblyScript
      "ast_json"  = Abstract Syntax Tree (JSON)
      "html"      = HTML Documentation
      "md"        = Markdown Documentation
      "sch_json"  = Compiled Schema (JSON)
      "ts"        = TypeScript

  <dir>
    Directory where the generated output should be written


Config File:

  -conf <conf_file>

  <conf_file>
    Path to a JSONC configuration file in place of the typical input / output args


Options:

  -quiet
    Disables all output to stdout and stderr.

  { -log[:logger] <log_level> }
    Sets the log level for a specific logger (or all loggers at once).

    Loggers:
      "main"
      "parser"
      "linker"
      "c_as"
      "c_html"
      "c_md"
      "c_ts"

    Log Levels:
      0 = None
      1 = Error
      2 = Warn
      3 = Info (Default)
      4 = Verbose
      5 = Debug
      6 = Silly


Examples:
  
  # Compile schema files in "schemas" directory and output both TypeScript code and HTML docs
  bfec -in "./schemas" "main.bfec" -out ts "./src" -out html "./docs"
    
  # Parse to an AST and enable debug logging in the parser
  bfec -in "./schemas" "main.bfec" -out ast "./ast" -log:parser 5
    
  # Compile using options from a config file, and disable all non-error logging
  bfec -conf "./conf.jsonc" -log 1


```

## Programatic Usage

```typescript
import {
  parse_src_to_ast,
  link_ast_to_schema,
  compile_schema_to_assemblyscript,
  compile_schema_to_html,
  compile_schema_to_markdown,
  compile_schema_to_typescript
} from 'bfec';

const contents = `
struct $ {
  foo: u32;
  bar: u32;
}
`;

// Parse schema document into an AST (Abstract Syntax Tree)
const ast = parse_src_to_ast(contents);

// Link AST into an intermediate Schema object
const schema = link_ast_to_schema(ast, {
  async resolve_import(path: string) {
    // Find referenced schema for imports....
    const imported_contents = '';

    // Parse the import and return an AST for the imported file
    const imported_ast = parse_bfec_schema(imported_contents);
    return imported_ast;
  }
});

// Compile the Schema object to whatever format(s) you want
const assemblyscript = compile_schema_to_assemblyscript(schema);
const html           = compile_schema_to_html(schema);
const markdown       = compile_schema_to_markdown(schema);
const typescript     = compile_schema_to_typescript(schema);
```

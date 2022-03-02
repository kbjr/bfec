
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
$ npm i -g @k/bfec
```

## CLI Usage

```
λ bfec -h

bfec: Binary Format Encoder Compiler
Version 0.1.0

Usage:

  bfec -in <dir> <file> { -out <format> <dir> } [ OPTIONS ]


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


Options:

  -quiet
    Disables all output to stdout and stderr.

  { -log[:logger] <log_level> }
    Sets the log level for a specific logger (or all loggers at once).

    Loggers:
      "main"
      "parser"
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
    
  # Compile to a TypeScript library, and disable all non-error logging
  bfec -in "./schemas" "main.bfec" -out ts "./src" -log 1


```

## Programatic Usage

```typescript
import {
  parse_bfec_schema,
  compile_ast_to_schema,
  compile_to_assemblyscript,
  compile_to_html,
  compile_to_markdown,
  compile_to_typescript
} from '@k/bfec';

const contents = `
struct $ {
  foo: u32;
  bar: u32;
}
`;

// Parse schema document into an AST (Abstract Syntax Tree)
const ast = parse_bfec_schema(contents);

// Link AST into an intermediate Schema object
const schema = compile_ast_to_schema(ast, {
  async resolve_import(path: string) {
    // Find referenced schema for imports....
    const imported_contents = '';

    // Parse the import and return an AST for the imported file
    const imported_ast = parse_bfec_schema(imported_contents);
    return imported_ast;
  }
});

// Compile the Schema object to whatever format(s) you want
const assemblyscript = compile_to_assemblyscript(schama);
const html           = compile_to_html(schama);
const markdown       = compile_to_markdown(schama);
const typescript     = compile_to_typescript(schama);
```

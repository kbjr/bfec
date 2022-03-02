
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

## Usage

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

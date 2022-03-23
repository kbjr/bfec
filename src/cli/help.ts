
import { main as log, logger } from './log';
import { grey, green, yellow, cyan } from 'chalk';

// Color mapping
const flag    = grey;
const param   = cyan;
const options = grey;
const string  = green;
const number  = yellow;
const comment = grey;

export const print_version = () => log.info(require('../../package.json').version);

export const print_help = () => log.info(`
bfec: Binary Format Encoder Compiler
Version ${require('../../package.json').version}

Usage:

  bfec ${flag('-in')} ${param('<dir>')} ${param('<file>')} { ${flag('-out')} ${param('<format>')} ${param('<dir>')} } ${options('[ OPTIONS ]')}
  bfec ${flag('-conf')} ${param('<conf_file>')} ${options('[ OPTIONS ]')}


Input:

  ${flag('-in')} ${param('<dir>')} ${param('<file>')}

  ${param('<dir>')}
    The root input directory; All local schema files included must be under
    this directory.

  ${param('<file>')}
    The entrypoint file that contains the root ${string('"$"')} schema definition, relative
    to the root directory.


Outputs:

  { ${flag('-out')} ${param('<format>')} ${param('<dir>')} }

  ${param('<format>')}
    The output format to be generated, one of the following:

      ${string('"as"')}        = AssemblyScript
      ${string('"ast_json"')}  = Abstract Syntax Tree (JSON)
      ${string('"html"')}      = HTML Documentation
      ${string('"md"')}        = Markdown Documentation
      ${string('"sch_json"')}  = Compiled Schema (JSON)
      ${string('"ts"')}        = TypeScript

  ${cyan('<dir>')}
    Directory where the generated output should be written


Config File:

  ${flag('-conf')} ${param('<conf_file>')}

  ${param('<conf_file>')}
    Path to a JSONC configuration file in place of the typical input / output args


Options:

  ${flag('-quiet')}
    Disables all output to stdout and stderr.

  { ${flag('-log')}${param('[:logger]')} ${param('<log_level>')} }
    Sets the log level for a specific logger (or all loggers at once).

    Loggers:
      ${string('"' + logger.main + '"')}
      ${string('"' + logger.parser + '"')}
      ${string('"' + logger.linker + '"')}
      ${string('"' + logger.c_as + '"')}
      ${string('"' + logger.c_html + '"')}
      ${string('"' + logger.c_md + '"')}
      ${string('"' + logger.c_ts + '"')}

    Log Levels:
      ${number('0')} = None
      ${number('1')} = Error
      ${number('2')} = Warn
      ${number('3')} = Info (Default)
      ${number('4')} = Verbose
      ${number('5')} = Debug
      ${number('6')} = Silly


Examples:
  
  ${comment('# Compile schema files in "schemas" directory and output both TypeScript code and HTML docs')}
  bfec ${flag('-in')} ${string('"./schemas"')} ${string('"main.bfec"')} ${flag('-out')} ts ${string('"./src"')} ${flag('-out')} html ${string('"./docs"')}
    
  ${comment('# Parse to an AST and enable debug logging in the parser')}
  bfec ${flag('-in')} ${string('"./schemas"')} ${string('"main.bfec"')} ${flag('-out')} ast ${string('"./ast"')} ${flag('-log:parser')} ${number('5')}
    
  ${comment('# Compile using options from a config file, and disable all non-error logging')}
  bfec ${flag('-conf')} ${string('"./conf.jsonc"')} ${flag('-log')} ${number('1')}
`);

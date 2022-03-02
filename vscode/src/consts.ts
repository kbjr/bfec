
export const use_optimized_frontend_compiler = true;

export const use_optimized_linker = true;

export const mem_frontend_compiler_min_pages = 50;
export const mem_frontend_compiler_max_pages = 500;

export const mem_linker_min_pages = 50;
export const mem_linker_max_pages = 500;

export const watlc_name = 'watlc-vscode-extension' as const;
export const watlc_version = require('../package.json').version as string;
export const watlc_more_info = 'https://example.com' as const;

export const default_globals = 'std/globals';

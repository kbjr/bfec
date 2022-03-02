"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatlFile = exports.init_frontend_compiler = exports.to_buffer = exports.to_json = void 0;
const frontend_compiler_1 = require("@~/frontend-compiler");
const consts_1 = require("./consts");
var frontend_compiler_2 = require("@~/frontend-compiler");
Object.defineProperty(exports, "to_json", { enumerable: true, get: function () { return frontend_compiler_2.to_json; } });
Object.defineProperty(exports, "to_buffer", { enumerable: true, get: function () { return frontend_compiler_2.to_buffer; } });
let ready = false;
async function init_frontend_compiler() {
    if (!ready) {
        ready = (async () => {
            await (0, frontend_compiler_1.load_wasm)(consts_1.use_optimized_frontend_compiler);
            await (0, frontend_compiler_1.init_wasm)(consts_1.mem_frontend_compiler_min_pages, consts_1.mem_frontend_compiler_max_pages);
            ready = true;
        })();
    }
    await ready;
}
exports.init_frontend_compiler = init_frontend_compiler;
class WatlFile {
    constructor(file_path, source_text) {
        this.file_path = file_path;
        this.source_text = source_text;
        this.source_file = null;
        this.file_ast = null;
        this.ir_file = null;
        this.errors = null;
    }
    to_ast() {
        const file = new frontend_compiler_1.SourceFile(this.file_path);
        file.file_str = this.source_text;
        this.file_ast = (0, frontend_compiler_1.parse_source_file)(this.file_path, this.source_file);
    }
}
exports.WatlFile = WatlFile;
//# sourceMappingURL=frontend-compiler.js.map
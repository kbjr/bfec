"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.set_log_level = exports.log_level = void 0;
var log_level;
(function (log_level) {
    log_level[log_level["none"] = 0] = "none";
    log_level[log_level["error"] = 1] = "error";
    log_level[log_level["warn"] = 2] = "warn";
    log_level[log_level["info"] = 3] = "info";
    log_level[log_level["verbose"] = 4] = "verbose";
    log_level[log_level["debug"] = 5] = "debug";
    log_level[log_level["silly"] = 6] = "silly";
})(log_level = exports.log_level || (exports.log_level = {}));
let level = log_level.info;
function set_log_level(new_level) {
    level = new_level;
}
exports.set_log_level = set_log_level;
exports.log = {
    error(message, ...others) {
        if (level >= log_level.error) {
            console.error(message, ...others);
        }
    },
    warn(message, ...others) {
        if (level >= log_level.warn) {
            console.warn(message, ...others);
        }
    },
    info(message, ...others) {
        if (level >= log_level.info) {
            console.info(message, ...others);
        }
    },
    verbose(message, ...others) {
        if (level >= log_level.verbose) {
            console.debug(message, ...others);
        }
    },
    debug(message, ...others) {
        if (level >= log_level.debug) {
            console.debug(message, ...others);
        }
    },
    silly(message, ...others) {
        if (level >= log_level.silly) {
            console.debug(message, ...others);
        }
    },
    time(label) {
        if (level >= log_level.verbose) {
            console.time(label);
        }
    },
    timeEnd(label) {
        if (level >= log_level.verbose) {
            console.timeEnd(label);
        }
    }
};
//# sourceMappingURL=log.js.map
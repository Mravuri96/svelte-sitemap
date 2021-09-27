"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSitemap = void 0;
const global_helper_1 = require("./helpers/global.helper");
const vars_helper_1 = require("./helpers/vars.helper");
const vars_1 = require("./vars");
const createSitemap = async (domain = vars_1.DOMAIN, options) => {
    var _a;
    if (options === null || options === void 0 ? void 0 : options.debug) {
        console.log('OPTIONS', options);
    }
    const json = await (0, global_helper_1.prepareData)(domain, options);
    if (options === null || options === void 0 ? void 0 : options.debug) {
        console.log('RESULT', json);
    }
    if (json.length) {
        (0, global_helper_1.writeSitemap)(json, options);
    }
    else {
        console.error(vars_helper_1.cliColors.red, (0, vars_helper_1.errorMsg)((_a = options.outDir) !== null && _a !== void 0 ? _a : vars_1.OUT_DIR));
    }
};
exports.createSitemap = createSitemap;

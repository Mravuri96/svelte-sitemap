"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMsg = exports.successMsg = exports.cliColors = void 0;
exports.cliColors = {
    cyanAndBold: '\x1b[36m\x1b[1m%s\x1b[22m\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    red: '\x1b[31m%s\x1b[0m'
};
const successMsg = (outDir) => `  ✔ done. Check your new sitemap here: ./${outDir}/sitemap.xml`;
exports.successMsg = successMsg;
const errorMsg = (outDir) => `  × Make sure you are using this script as 'postbuild' so '${outDir}' folder was successfully created before running this script. See https://github.com/bartholomej/svelte-sitemap#readme`;
exports.errorMsg = errorMsg;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSitemap = exports.prepareData = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = __importDefault(require("fs"));
const xmlbuilder2_1 = require("xmlbuilder2");
const package_json_1 = require("../../package.json");
const vars_1 = require("../vars");
const vars_helper_1 = require("./vars.helper");
const getUrl = (url, domain, options) => {
    var _a;
    let slash = domain.split('/').pop() ? '/' : '';
    let trimmed = url
        .split(((_a = options === null || options === void 0 ? void 0 : options.outDir) !== null && _a !== void 0 ? _a : vars_1.OUT_DIR) + '/')
        .pop()
        .replace('index.html', '');
    // Remove trailing slashes
    if (!(options === null || options === void 0 ? void 0 : options.trailingSlashes)) {
        trimmed = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
        slash = trimmed ? slash : '';
    }
    return `${domain}${slash}${trimmed}`;
};
async function prepareData(domain, options) {
    var _a;
    console.log(vars_helper_1.cliColors.cyanAndBold, `> Using ${vars_1.APP_NAME}`);
    const ignore = prepareIgnored(options === null || options === void 0 ? void 0 : options.ignore, options === null || options === void 0 ? void 0 : options.outDir);
    const pages = await (0, fast_glob_1.default)(`${(_a = options === null || options === void 0 ? void 0 : options.outDir) !== null && _a !== void 0 ? _a : vars_1.OUT_DIR}/**/*.html`, { ignore });
    const results = pages.map((page) => {
        var _a;
        return {
            page: getUrl(page, domain, options),
            changeFreq: (_a = options === null || options === void 0 ? void 0 : options.changeFreq) !== null && _a !== void 0 ? _a : '',
            lastMod: (options === null || options === void 0 ? void 0 : options.resetTime) ? new Date().toISOString().split('T')[0] : ''
        };
    });
    return results;
}
exports.prepareData = prepareData;
const writeSitemap = (items, options) => {
    var _a;
    const sitemap = (0, xmlbuilder2_1.create)({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
    });
    if (options === null || options === void 0 ? void 0 : options.attribution) {
        sitemap.com(` This file was automatically generated by https://github.com/bartholomej/svelte-sitemap v${package_json_1.version} `);
    }
    for (const item of items) {
        const page = sitemap.ele('url');
        page.ele('loc').txt(item.page);
        if (item.changeFreq) {
            page.ele('changefreq').txt(item.changeFreq);
        }
        if (item.lastMod) {
            page.ele('lastmod').txt(item.lastMod);
        }
    }
    const xml = sitemap.end({ prettyPrint: true });
    const outDir = (_a = options === null || options === void 0 ? void 0 : options.outDir) !== null && _a !== void 0 ? _a : vars_1.OUT_DIR;
    try {
        fs_1.default.writeFileSync(`${outDir}/sitemap.xml`, xml);
        console.log(vars_helper_1.cliColors.green, (0, vars_helper_1.successMsg)(outDir));
    }
    catch (e) {
        console.error(vars_helper_1.cliColors.red, (0, vars_helper_1.errorMsg)(outDir), e);
    }
};
exports.writeSitemap = writeSitemap;
const prepareIgnored = (ignored, outDir = vars_1.OUT_DIR) => {
    let ignore;
    if (ignored) {
        ignore = Array.isArray(ignored) ? ignored : [ignored];
        ignore = ignore.map((ignoredPage) => `${outDir}/${ignoredPage}`);
    }
    return ignore;
};

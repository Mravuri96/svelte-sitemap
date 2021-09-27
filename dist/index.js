#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const package_json_1 = require("./package.json");
const index_1 = require("./src/index");
const REPO_URL = 'https://github.com/bartholomej/svelte-sitemap';
let stop = false;
const args = (0, minimist_1.default)(process.argv.slice(2), {
    string: ['domain', 'out-dir', 'ignore', 'change-freq'],
    boolean: ['attribution', 'reset-time', 'trailing-slashes', 'debug', 'version'],
    default: { attribution: true, 'trailing-slashes': false, default: false },
    alias: {
        d: 'domain',
        D: 'domain',
        h: 'help',
        H: 'help',
        v: 'version',
        V: 'version',
        O: 'out-dir',
        o: 'out-dir',
        r: 'reset-time',
        R: 'reset-time',
        c: 'change-freq',
        C: 'change-freq',
        i: 'ignore',
        I: 'ignore'
    },
    unknown: (err) => {
        console.log('⚠ Those arguments are not supported:', err);
        console.log('Use: `svelte-sitemap --help` for more options.\n');
        stop = true;
        return false;
    }
});
if (args.help || args.version === '' || args.version === true) {
    const log = args.help ? console.log : console.error;
    log('Static Sitemap generator for SvelteKit');
    log('');
    log(`svelte-sitemap ${package_json_1.version} (check updates: ${REPO_URL})`);
    log('');
    log('Options:');
    log('');
    log('  -d, --domain            Use your domain (eg. https://example.com)');
    log('  -o, --out-dir           Custom output dir');
    log('  -i, --ignore            Exclude some pages or folders');
    log('  -t, --trailing-slashes  Do you like trailing slashes?');
    log('  -r, --reset-time        Set modified time to now');
    log('  -c, --change-freq       Set change frequency `weekly` | `daily` | ...');
    log('  -v, --version           Show version');
    log('  --debug                 Debug mode');
    log(' ');
    process.exit(args.help ? 0 : 1);
}
else if (!args.domain) {
    console.log(`⚠ svelte-sitemap: --domain argument is required.\n\nSee instructions: ${REPO_URL}\n\nExample:\n\n  svelte-sitemap --domain https://mydomain.com\n`);
    process.exit(0);
}
else if (!args.domain.includes('http')) {
    console.log(`⚠ svelte-sitemap: --domain argument must starts with https://\n\nSee instructions: ${REPO_URL}\n\nExample:\n\n  svelte-sitemap --domain https://mydomain.com\n`);
    process.exit(0);
}
else if (stop) {
    // Do nothing if there is something suspicious
}
else {
    const domain = args.domain ? args.domain : undefined;
    const debug = args.debug === '' || args.debug === true ? true : false;
    const resetTime = args['reset-time'] === '' || args['reset-time'] === true ? true : false;
    const trailingSlashes = args['trailing-slashes'] === '' || args['trailing-slashes'] === true ? true : false;
    const changeFreq = args['change-freq'];
    const outDir = args['out-dir'];
    const ignore = args['ignore'];
    const attribution = args['attribution'] === '' || args['attribution'] === false ? false : true;
    const options = {
        debug,
        resetTime,
        changeFreq,
        outDir,
        attribution,
        ignore,
        trailingSlashes
    };
    (0, index_1.createSitemap)(domain, options);
}

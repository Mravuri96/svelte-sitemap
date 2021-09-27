import fg from 'fast-glob';
import fs from 'fs';
import { create } from 'xmlbuilder2';
import { version } from '../../package.json';
import { Options, PagesJson } from '../interfaces/global.interface';
import { APP_NAME, OUT_DIR } from '../vars';
import { cliColors, errorMsg, successMsg } from './vars.helper';

const getUrl = (url: string, domain: string, options: Options) => {
  let slash = domain.split('/').pop() ? '/' : '';

  let trimmed = url
    .split((options?.outDir ?? OUT_DIR) + '/')
    .pop()
    .replace('index.html', '');

  // Remove trailing slashes
  if (!options?.trailingSlashes) {
    trimmed = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
    slash = trimmed ? slash : '';
  }
  return `${domain}${slash}${trimmed}`;
};

export async function prepareData(domain: string, options?: Options): Promise<PagesJson[]> {
  console.log(cliColors.cyanAndBold, `> Using ${APP_NAME}`);

  const ignore = prepareIgnored(options?.ignore, options?.outDir);
  const pages: string[] = await fg(`${options?.outDir ?? OUT_DIR}/**/*.html`, { ignore });
  const results: PagesJson[] = pages.map((page) => {
    return {
      page: getUrl(page, domain, options),
      changeFreq: options?.changeFreq ?? '',
      lastMod: options?.resetTime ? new Date().toISOString().split('T')[0] : ''
    };
  });

  return results;
}

export const writeSitemap = (items: PagesJson[], options: Options): void => {
  const sitemap = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
  });
  if (options?.attribution) {
    sitemap.com(
      ` This file was automatically generated by https://github.com/bartholomej/svelte-sitemap v${version} `
    );
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

  const outDir = options?.outDir ?? OUT_DIR;

  try {
    fs.writeFileSync(`${outDir}/sitemap.xml`, xml);
    console.log(cliColors.green, successMsg(outDir));
  } catch (e) {
    console.error(cliColors.red, errorMsg(outDir), e);
  }
};

const prepareIgnored = (
  ignored: string | string[],
  outDir: string = OUT_DIR
): string[] | undefined => {
  let ignore: string[] | undefined;
  if (ignored) {
    ignore = Array.isArray(ignored) ? ignored : [ignored];
    ignore = ignore.map((ignoredPage) => `${outDir}/${ignoredPage}`);
  }
  return ignore;
};

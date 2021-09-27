import { Options, PagesJson } from '../interfaces/global.interface';
export declare function prepareData(domain: string, options?: Options): Promise<PagesJson[]>;
export declare const writeSitemap: (items: PagesJson[], options: Options) => void;

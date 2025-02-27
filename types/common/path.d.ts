export type PathTokenText = {
    type: 'text';
    value: string;
};
export type PathTokenParam = {
    type: 'param';
    name: string;
};
export type PathTokenSpread = {
    type: 'spread';
    name: string;
};
export type PathTokenGroup = {
    type: 'group';
    tokens: TokenGroupTokens[];
};
type TokenGroupTokens = PathTokenText | PathTokenParam | PathTokenSpread;
export type PathToken = PathTokenText | PathTokenParam | PathTokenSpread | PathTokenGroup;
declare function pathToRegexp(path: string, { end, trailing, sensitive, }?: {
    /**
     * Matches the path completely without trailing characters. (default: `true`)
     */
    end?: boolean;
    /**
     * Allows optional trailing delimiter to match. (default: `true`)
     */
    trailing?: boolean;
    /**
     * Match will be case sensitive. (default: `false`)
     */
    sensitive?: boolean;
}): {
    regexp: RegExp;
    weight: string;
    sample: string;
    origin: string;
    params: (PathTokenParam | PathTokenSpread)[];
    tokens: PathToken[];
    spread: boolean;
};
declare function pathToParams(path: string, data: PathToRegexp): {
    [key: string]: string;
} | null;
export type PathToRegexp = ReturnType<typeof pathToRegexp>;
export type PathToParams = ReturnType<typeof pathToParams>;
export { pathToRegexp as toRegexp, pathToParams as toParams };

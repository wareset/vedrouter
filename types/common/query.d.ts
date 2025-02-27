declare function queryDecode(str: string, sep?: string | null, eq?: string | null, options?: {
    decodeURIComponent: (encodedURIComponent: string) => string;
}): {
    [key: string]: string | string[];
};
declare function queryEncode(obj: {
    [key: string]: string | string[];
}, sep?: string | null, eq?: string | null, options?: {
    encodeURIComponent: (uri: string | number | boolean) => string;
}): string;
export { queryDecode as decode, queryEncode as encode };

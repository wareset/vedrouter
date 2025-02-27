export declare class UrlParsed {
    hash: string;
    search: string;
    pathname: string;
    protocol: string;
    username: string;
    password: string;
    hostname: string;
    port: string;
    host: string;
    origin: string;
    href: string;
    constructor(raw: string);
    toString(): string;
}

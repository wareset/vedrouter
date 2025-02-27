/*
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                        href                                              │
├────────┬──┬─────────────────┬────────────────────────┬───────────────────────────┬───────┤
│protocol│  │      auth       │          host          │           path            │ hash  │
│        │  │                 ├─────────────────┬──────┼──────────┬────────────────┤       │
│        │  │                 │    hostname     │ port │ pathname │     search     │       │
│        │  │                 │                 │      │          ├─┬──────────────┤       │
│        │  │                 │                 │      │          │ │    query     │       │
" https:  //   user  :  pass  @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│        │  │        │        │    hostname     │ port │          │                │       │
│        │  │        │        ├─────────────────┴──────┤          │                │       │
│protocol│  │username│password│          host          │          │                │       │
├────────┴──┼────────┴────────┼────────────────────────┤          │                │       │
│  origin   │                 │         origin         │ pathname │     search     │ hash  │
├───────────┴─────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                        href                                              │
└──────────────────────────────────────────────────────────────────────────────────────────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
*/

// import { queryDecode, queryEncode } from './query'

const REG_REPLACE_BACKSLASHES = /\\/g

const REG_FOR_PROTOCOL = /^([a-z]+[a-z\d]*\:)?(\/*)/i
const REG_FOR_HOSTNAME = /^(?:([^:/]+)(?:\:([^/]+))?@)?(?:([^/@]+?)(?:\:(\d+))?)(\/[^]*)?$/

// function encode(s: any) {
//   return encodeURIComponent('' + s)
// }

const PROTOCOLS = {
  'http:': 1,
  'https:': 1,
  'ftp:': 1,
  // 'gopher:': 1,
  'file:': 1,
  'ws:': 1,
  'wss:': 1,
} as const

const LOCATION =
  typeof location !== 'undefined'
    ? location
    : { protocol: 'http:', hostname: 'localhost', port: '', pathname: '/' }

export class UrlParsed {
  hash: string
  // path
  search: string
  pathname: string

  protocol: string
  // auth
  username: string
  password: string
  // host
  hostname: string
  port: string
  host: string

  origin: string
  href: string

  constructor(raw: string) {
    raw = raw.trim()
    let idx: number
    let tmp: string | RegExpMatchArray | null
    //
    // hash
    //
    let hash = ''
    if ((idx = raw.indexOf('#')) > -1) {
      if ((tmp = raw.slice(idx)).length > 2) hash = tmp
      raw = raw.slice(0, idx)
    }
    this.hash = hash
    //
    // search
    //
    let search = ''
    if ((idx = raw.indexOf('?')) > -1) {
      if ((tmp = raw.slice(idx)).length > 2) search = tmp
      raw = raw.slice(0, idx)
    }
    this.search = search
    //
    // other
    //
    tmp = (raw = raw.replace(REG_REPLACE_BACKSLASHES, '/')).match(REG_FOR_PROTOCOL)!

    let pathname = '/'

    let slashes = tmp[2]
    let protocol = tmp[1]
    //
    // auth
    let username = ''
    let password = ''
    //
    // host
    let hostname = ''
    let port = ''
    let host = ''

    let origin = 'null'
    let href = ''

    let needParseHostname = false
    if (protocol) {
      protocol = protocol.toLowerCase()
      if (!PROTOCOLS.hasOwnProperty(protocol)) {
        pathname = raw.slice(protocol.length)
        href = protocol
      } else if (protocol === 'file:') {
        pathname += raw.slice(tmp[0].length)
        origin = 'file://'
        href = protocol + (slashes.length === 2 ? '/' : '//')
      } else {
        needParseHostname = true
      }
    } else {
      protocol = LOCATION.protocol
      if (slashes.length < 2) {
        pathname = raw ? (raw[0] === '/' ? '' : '/') + raw : LOCATION.pathname
        hostname = LOCATION.hostname
        host = hostname + ((port = LOCATION.port) ? ':' + port : '')
        href = origin = protocol + '//' + host
      } else {
        needParseHostname = true
      }
    }

    if (needParseHostname) {
      if ((tmp = raw.slice(tmp[0].length).match(REG_FOR_HOSTNAME))) {
        pathname = tmp[5] || pathname
        host = (hostname = tmp[3] || '') + ((port = tmp[4] || '') ? ':' + port : '')
        origin = protocol + '//' + host
        username = tmp[1] || ''
        password = tmp[2] || ''
      }
      href =
        (username ? username + (password ? ':' + password : '') + '@' : '') +
        protocol +
        '//' +
        host
    }

    this.pathname = pathname

    this.protocol = protocol

    this.username = username
    this.password = password

    this.hostname = hostname
    this.port = port
    this.host = host

    this.origin = origin
    this.href = href + pathname + search + hash
  }

  toString() {
    return this.href
  }
}

// const str = 'https://user:pass@@@sub.example.com:8080/p/a/t/h?w=%D6%D0%CE%C4&foo=bar#hash'
// console.log(new UrlParsed(str))

export type PathTokenText = { type: 'text'; value: string }
export type PathTokenParam = { type: 'param'; name: string }
export type PathTokenSpread = { type: 'spread'; name: string }
export type PathTokenGroup = { type: 'group'; tokens: TokenGroupTokens[] }
type TokenGroupTokens = PathTokenText | PathTokenParam | PathTokenSpread
export type PathToken = PathTokenText | PathTokenParam | PathTokenSpread | PathTokenGroup

const REG_FOR_PARSE_PATHES = /\/?\[[^\]]+\]?|\/?[^\[/]+/g
const REG_FOR_ESCAPE_VALUE = /[.+*?^${}()[\]|/\\]/g
const REG_FOR_CHECK_PARAMS = /^\/?\[[^/[\]]+\]$/
const REG_FOR_CHECK_VALUES = /^\/?[^/[\]]+$/
const REG_FOR_CHECK_SPREAD = /^\/?\[\.\.\./
// const REG_FOR_TRIM_SLASHES = /^\/+|\/+$/g

function typeError(s: string, n?: number) {
  s = 'Router path: ' + s
  n === +n! && (s += ` (col: ${n})`)
  throw new TypeError(s)
}

/**
 * Escape a regular expression string.
 */
// function escapeText(str: string) {
//   return str.replace(/[.+*?^${}()[\]|/\\]/g, '\\$&')
// }

function _getWeight(token: PathToken) {
  let res = 5
  switch (token.type) {
    case 'text':
      res = 1
      break
    case 'param':
      res = 5
      break
    case 'spread':
      res = 9
      break
    case 'group': {
      for (let a = token.tokens, l = a.length - 1, i = l, type: string; i >= 0; i--) {
        type = a[i].type
        if (type === 'text') {
          if (i === 0) res--
          else if (i === l) {
            res--
            if (a[0].type === 'text') res--
          } else if (res === 5 || res === 9) res--
        } else if (type === 'spread' && res < 6) res += 4
      }
    }
  }
  return res
}

/*
WEIGHT
1        1        1        1
/--------/--------/--------/--------

2        1        1        1
/--[---]-/--------/--------/--------
3        1        1        1
/---[---]/--------/--------/--------
4        1        1        1
/[---]---/--------/--------/--------
4        1        1        1
/[-]--[-]/--------/--------/--------

5        1        1        1
/[------]/--------/--------/--------

6        1        1        1
/--[...]-/--------/--------/--------
7        1        1        1
/---[...]/--------/--------/--------
8        1        1        1
/[...]---/--------/--------/--------

9        1        1        1
/[...---]/--------/--------/--------
*/

function pathToRegexp(
  path: string,
  {
    end = true,
    trailing = true,
    sensitive = false,
  }: {
    /**
     * Matches the path completely without trailing characters. (default: `true`)
     */
    end?: boolean
    /**
     * Allows optional trailing delimiter to match. (default: `true`)
     */
    trailing?: boolean
    /**
     * Match will be case sensitive. (default: `false`)
     */
    sensitive?: boolean
  } = {}
) {
  const SAMPLE_ARRAY: string[] = []
  const REGEXP_ARRAY: string[] = ['^(?:']
  const CACHE_PARAMS: { [key: string]: any } = {}

  let spread = false
  const tokens: PathToken[] = []
  const params: (PathTokenParam | PathTokenSpread)[] = []

  let tokensCurrent: PathToken[] = tokens

  let token: PathToken
  let isSlash: boolean, isSpread: boolean
  let lastParam: string | undefined

  let raw: string
  let m: RegExpExecArray | null

  REG_FOR_PARSE_PATHES.lastIndex = 0
  for (; (m = REG_FOR_PARSE_PATHES.exec(path)); ) {
    raw = m[0]
    isSlash = raw[0] === '/'
    // console.log(m)

    if (isSlash) {
      tokensCurrent = tokens
      lastParam = ''
    } else if (tokensCurrent === tokens && tokens.length) {
      // @ts-ignore
      tokensCurrent.push((token = { type: 'group', tokens: [tokens.pop()!] }))
      // @ts-ignore
      tokensCurrent = token.tokens
    }

    if (raw[isSlash ? 1 : 0] === '[') {
      if (!REG_FOR_CHECK_PARAMS.test(raw)) {
        typeError(`Param "${raw}" has a incorrect name`, m.index)
      }
      raw = raw.slice(
        (isSpread = REG_FOR_CHECK_SPREAD.test(raw)) ? (isSlash ? 5 : 4) : isSlash ? 2 : 1,
        -1
      )

      if (CACHE_PARAMS[raw] === REGEXP_ARRAY) {
        typeError(`Param "${raw}" is duplicated`, m.index)
      }
      CACHE_PARAMS[raw] = REGEXP_ARRAY

      if (lastParam) {
        typeError(`Param "${raw}" right behind the "${lastParam}"`, m.index)
      }

      if (isSlash) {
        REGEXP_ARRAY.push('\\/')
        SAMPLE_ARRAY.push('/')
      }

      if (isSpread) {
        spread = true
        token = { type: 'spread', name: raw }
        REGEXP_ARRAY.push('([^]+)')
        SAMPLE_ARRAY.push('[[]]/[[]]')
      } else {
        token = { type: 'param', name: raw }
        REGEXP_ARRAY.push('([^\\/]+)')
        SAMPLE_ARRAY.push('[[[]]]')
      }
      lastParam = raw
      params.push(token)
    } else {
      if (!REG_FOR_CHECK_VALUES.test(raw)) {
        typeError(`Text "${raw}" has incorrect characters`, m.index)
      }
      token = { type: 'text', value: raw }
      REGEXP_ARRAY.push(raw.replace(REG_FOR_ESCAPE_VALUE, '\\$&'))
      SAMPLE_ARRAY.push(raw)
      lastParam = ''
    }
    tokensCurrent.push(token)
  }

  REGEXP_ARRAY.push(')')
  if (trailing) REGEXP_ARRAY.push('(?:\\/$)?')
  REGEXP_ARRAY.push(end ? '$' : '(?=\\/|$)')

  return {
    regexp: new RegExp(REGEXP_ARRAY.join(''), sensitive ? '' : 'i'),
    weight: tokens.map(_getWeight).join(''),
    sample: SAMPLE_ARRAY.join(''),
    origin: path,
    params,
    tokens,
    spread,
  }
}

function pathToParams(path: string, data: PathToRegexp): { [key: string]: string } | null {
  const m = path.match(data.regexp)
  let res: null | { [key: string]: string } = null
  if (m) {
    res = Object.create(null) as {} // { __proto__: null } as {}
    for (let a = data.params, l = a.length, i = 0, token: PathToken; i < l; ) {
      token = a[i++]
      res[token.name] = m[i]
      // token.type === 'param' ? m[i] : m[i].replace(REG_FOR_TRIM_SLASHES, '').split('/')
    }
  }
  return res
}

export type PathToRegexp = ReturnType<typeof pathToRegexp>
export type PathToParams = ReturnType<typeof pathToParams>
export { pathToRegexp as toRegexp, pathToParams as toParams }

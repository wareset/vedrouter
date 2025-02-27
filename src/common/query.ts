function queryDecode(
  str: string,
  sep?: string | null,
  eq?: string | null,
  options?: { decodeURIComponent: (encodedURIComponent: string) => string }
): { [key: string]: string | string[] } {
  sep || (sep = '&'), eq || (eq = '=')

  const ro: any = Object.create(null) as {}
  const decode = (options && options.decodeURIComponent) || decodeURIComponent

  for (let a = str.split(sep), l = a.length, i = 0, k: string, v: string; i < l; i++) {
    try {
      ;[k, v] = a[i].split(eq).map(decode)
      // if (k) {
      v = v || ''
      if (k in ro) Array.isArray(ro[k]) ? ro[k].push(v) : (ro[k] = [ro[k], v])
      else ro[k] = v
      // }
    } catch (e) {
      console.error(e)
    }
  }

  return ro
}

// function stringifyPrimitive(v: any, encode: any) {
//   switch (typeof v) {
//     case 'string':
//     case 'number':
//     case 'bigint':
//     case 'boolean':
//       v = encode('' + v)
//       break
//     default:
//       v = ''
//   }
//   return v
// }

function queryEncode(
  obj: { [key: string]: string | string[] },
  sep?: string | null,
  eq?: string | null,
  options?: { encodeURIComponent: (uri: string | number | boolean) => string }
): string {
  sep || (sep = '&'), eq || (eq = '=')

  const ra: string[] = []
  const encode = (options && options.encodeURIComponent) || encodeURIComponent
  let k: string, v: string | string[]

  for (k in obj) {
    try {
      ;(v = obj[k]), (k = encode(k))
      if (Array.isArray(v)) {
        for (let l = v.length, i = 0; i < l; i++) {
          try {
            v[i] !== '' ? ra.push(k + eq + encode(v[i])) : ra.push(k)
          } catch (e) {
            console.error(e)
          }
        }
      } else {
        v !== '' ? ra.push(k + eq + encode(v)) : ra.push(k)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return ra.join(sep)
}

export { queryDecode as decode, queryEncode as encode }

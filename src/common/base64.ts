const _btoa: (s: string) => string =
  typeof btoa !== 'undefined'
    ? btoa
    : function (s: string): string {
        return Buffer.from(s).toString('base64')
      }

const _atob: (s: string) => string =
  typeof atob !== 'undefined'
    ? atob
    : function (s: string): string {
        return Buffer.from(s, 'base64').toString()
      }

//
// base64Encode
function base64Encode(s: string): string {
  return _btoa(
    encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, function (_, p1) {
      return String.fromCharCode(+('0x' + p1))
    })
  )
}
// base64Encode
//

//
// base64Decode
function base64Decode(s: string): string {
  const res: string[] = []
  for (let a = _atob(s), i = 0, l = a.length; i < l; i++) {
    res.push('%' + ('00' + a[i].charCodeAt(0).toString(16)).slice(-2))
  }
  return decodeURIComponent(res.join(''))
}
// base64Decode
//

export { base64Encode as encode, base64Decode as decode }

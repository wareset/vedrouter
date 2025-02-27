import { encode as base64Encode, decode as base64Decode } from './base64'

function jwtUtf8ToBase64(str: string): string {
  return base64Encode(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]+$/g, '')
}

function _fix(n: number): string {
  return n === 3 ? '===' : n === 2 ? '==' : n === 1 ? '=' : ''
}
function jwtBase64ToUtf8(str: string): string {
  return base64Decode(
    str.replace(/-/g, '+').replace(/_/g, '/') + _fix(4 - (str.length % 4))
  )
}

// https://ru.wikipedia.org/wiki/JSON_Web_Token
function jwtCreate({
  verifier,
  password = '',
  payload = {},
  header = {},
}: {
  verifier: (s: string) => string
  password?: string

  /**
   * Заголовок
   * В заголовке указывается необходимая информация для описания самого токена.
   */
  header?: {
    /**
     * Обязательный ключ здесь только один:
     * alg: алгоритм, используемый для подписи/шифрования (в случае неподписанного JWT используется значение «none»).
     */
    alg?: string
    /**
     * typ: тип токена (type). Используется в случае, когда токены смешиваются с другими объектами, имеющими JOSE заголовки. Должно иметь значение «JWT».
     */
    typ?: string
    /**
     * cty: тип содержимого (content type). Если в токене помимо зарегистрированных служебных ключей есть пользовательские, то данный ключ не должен присутствовать. В противном случае должно иметь значение «JWT»
     */
    cty?: string
  }

  /**
   * Полезная нагрузка
   * В данной секции указывается пользовательская информация (например, имя пользователя и уровень его доступа), а также могут быть использованы некоторые служебные ключи. Все они являются необязательными:
   */
  payload?: {
    /**
     * iss: чувствительная к регистру строка или URI, которая является уникальным идентификатором стороны, генерирующей токен (issuer).
     */
    iss?: string
    /**
     * sub: чувствительная к регистру строка или URI, которая является уникальным идентификатором стороны, о которой содержится информация в данном токене (subject). Значения с этим ключом должны быть уникальны в контексте стороны, генерирующей JWT.
     */
    sub?: string
    /**
     * aud: массив чувствительных к регистру строк или URI, являющийся списком получателей данного токена. Когда принимающая сторона получает JWT с данным ключом, она должна проверить наличие себя в получателях — иначе проигнорировать токен (audience).
     */
    aud?: string
    /**
     * exp: время в формате Unix Time, определяющее момент, когда токен станет невалидным (expiration).
     */
    exp?: string
    /**
     * nbf: в противоположность ключу exp, это время в формате Unix Time, определяющее момент, когда токен станет валидным (not before).
     */
    nbf?: string
    /**
     * jti: строка, определяющая уникальный идентификатор данного токена (JWT ID).
     */
    jti?: string
    /**
     * iat: время в формате Unix Time, определяющее момент, когда токен был создан. iat и nbf могут не совпадать, например, если токен был создан раньше, чем время, когда он должен стать валидным (issued at).
     */
    iat?: string
  } & { [key: string]: any }
}): string {
  const HEADER = JSON.stringify({ alg: 'HS256', typ: 'JWT', ...header })
  const res = jwtUtf8ToBase64(HEADER) + '.' + jwtUtf8ToBase64(JSON.stringify(payload))
  const VERIFY = jwtUtf8ToBase64(verifier(res + password))
  return res + '.' + VERIFY
}

export {
  jwtCreate as create,
  jwtBase64ToUtf8 as base64ToUtf8,
  jwtUtf8ToBase64 as utf8ToBase64,
}

// import { jwt_create, hashFactory } from '@wareset/jwt'
// const hasher = hashFactory(3, 358)
// console.log(createJWT(hasher, '1', { id: '1' }))

export type RouteLocationRaw =
  | string
  | (({ path: string } | { name: string; params?: { [key: string]: string } }) & {
      query?: { [key: string]: string | string[] }
      hash?: string
      replace?: boolean
      // alias?: string | string[]
      // redirect?: RouteLocationRaw
    })

export class Router {
  addRoute(to: string) {
    return this
  }
  removeRoute(to: string) {
    return this
  }
  getRoutes() {
    return this
  }
  clearRoutes() {
    return this
  }

  push(to: RouteLocationRaw) {
    return this
  }
  replace(to: RouteLocationRaw) {
    return this
  }
  back() {
    return this.go(-1)
  }
  forward() {
    return this.go(1)
  }
  go(delta: number) {
    if ((delta |= 0)) {
      // TODO
    }
    return this
  }
}

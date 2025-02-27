export function handle_click(e: MouseEvent) {
  // https://github.com/sveltejs/sapper/blob/master/runtime/src/app/router/index.ts
  if (e.defaultPrevented) return
  if ((e.which == null ? e.button : e.which) !== 1) return
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

  let a: HTMLAnchorElement | SVGAElement = <any>e.target
  while (a && a.localName !== 'a') a = <any>a.parentNode
  if (!a) return

  // check if link is inside an svg
  // in this case, both href and target are always inside an object
  const isSVG = typeof a.href !== 'string'
  const href = isSVG ? (<SVGAElement>a).href.baseVal : (<HTMLAnchorElement>a).href
  if (!href) return

  // ?????
  if (href === location.href) {
    if (!location.hash) e.preventDefault()
    return
  }

  // Ignore if <a> has a target
  if (isSVG ? (<SVGAElement>a).target.baseVal : a.target) return

  // Ignore if tag has
  // 1. 'download' attribute
  // 2. rel='external' attribute
  if (a.hasAttribute('download') || a.getAttribute('rel') === 'external') return

  const url = new URL(href)

  // Don't handle hash changes
  if (url.pathname === location.pathname && url.search === location.search) return

  console.log('TODO')
}

/* eslint-disable */
function r(r,t){(null==t||t>r.length)&&(t=r.length);for(var e=0,n=Array(t);e<t;e++)n[e]=r[e];return n}function t(t,e){return function(r){if(Array.isArray(r))return r}(t)||function(r,t){var e=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(null!=e){var n,o,a,l,c=[],i=!0,u=!1;try{if(a=(e=e.call(r)).next,0===t){if(Object(e)!==e)return;i=!1}else for(;!(i=(n=a.call(e)).done)&&(c.push(n.value),c.length!==t);i=!0);}catch(r){u=!0,o=r}finally{try{if(!i&&null!=e.return&&(l=e.return(),Object(l)!==l))return}finally{if(u)throw o}}return c}}(t,e)||function(t,e){if(t){if("string"==typeof t)return r(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(r,e,n,o){e||(e="&"),n||(n="=");for(var a,l,c=Object.create(null),i=o&&o.decodeURIComponent||decodeURIComponent,u=r.split(e),f=u.length,s=0;s<f;s++)try{var y=t(u[s].split(n).map(i),2);a=y[0],l=(l=y[1])||"",a in c?Array.isArray(c[a])?c[a].push(l):c[a]=[c[a],l]:c[a]=l}catch(p){console.error(p)}return c}function n(r,t,e,n){t||(t="&"),e||(e="=");var o,a,l=[],c=n&&n.encodeURIComponent||encodeURIComponent;for(o in r)try{if(a=r[o],o=c(o),Array.isArray(a))for(var i=a.length,u=0;u<i;u++)try{""!==a[u]?l.push(o+e+c(a[u])):l.push(o)}catch(f){console.error(f)}else""!==a?l.push(o+e+c(a)):l.push(o)}catch(f){console.error(f)}return l.join(t)}export{e as decode,n as encode};

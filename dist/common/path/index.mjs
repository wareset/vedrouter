/* eslint-disable */
var e=/\/?\[[^\]]+\]?|\/?[^\[/]+/g,t=/[.+*?^${}()[\]|/\\]/g,a=/^\/?\[[^/[\]]+\]$/,r=/^\/?[^/[\]]+$/,p=/^\/?\[\.\.\./;function s(e,t){throw e="Router path: "+e,t===+t&&(e+=` (col: ${t})`),new TypeError(e)}function n(e){var t=5;switch(e.type){case"text":t=1;break;case"param":t=5;break;case"spread":t=9;break;case"group":for(var a,r=e.tokens,p=r.length-1,s=p;s>=0;s--)"text"===(a=r[s].type)?0===s?t--:s===p?(t--,"text"===r[0].type&&t--):5!==t&&9!==t||t--:"spread"===a&&t<6&&(t+=4)}return t}function h(h,{end:i=!0,trailing:u=!0,sensitive:o=!1}={}){var c,x,g,l,m,d,$=[],f=["^(?:"],v={},y=!1,k=[],b=[],w=k;for(e.lastIndex=0;d=e.exec(h);)(x="/"===(m=d[0])[0])?(w=k,l=""):w===k&&k.length&&(w.push(c={type:"group",tokens:[k.pop()]}),w=c.tokens),"["===m[x?1:0]?(a.test(m)||s(`Param "${m}" has a incorrect name`,d.index),v[m=m.slice((g=p.test(m))?x?5:4:x?2:1,-1)]===f&&s(`Param "${m}" is duplicated`,d.index),v[m]=f,l&&s(`Param "${m}" right behind the "${l}"`,d.index),x&&(f.push("\\/"),$.push("/")),g?(y=!0,c={type:"spread",name:m},f.push("([^]+)"),$.push("[[]]/[[]]")):(c={type:"param",name:m},f.push("([^\\/]+)"),$.push("[[[]]]")),l=m,b.push(c)):(r.test(m)||s(`Text "${m}" has incorrect characters`,d.index),c={type:"text",value:m},f.push(m.replace(t,"\\$&")),$.push(m),l=""),w.push(c);return f.push(")"),u&&f.push("(?:\\/$)?"),f.push(i?"$":"(?=\\/|$)"),{regexp:new RegExp(f.join(""),o?"":"i"),weight:k.map(n).join(""),sample:$.join(""),origin:h,params:b,tokens:k,spread:y}}function i(e,t){var a=e.match(t.regexp),r=null;if(a){r=Object.create(null);for(var p=t.params,s=p.length,n=0;n<s;)r[p[n++].name]=a[n]}return r}export{i as toParams,h as toRegexp};

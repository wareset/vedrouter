/* eslint-disable */
var e="undefined"!=typeof btoa?btoa:function(e){return Buffer.from(e).toString("base64")},n="undefined"!=typeof atob?atob:function(e){return Buffer.from(e,"base64").toString()};function o(n){return e(encodeURIComponent(n).replace(/%([0-9A-F]{2})/g,(function(e,n){return String.fromCharCode(+("0x"+n))})))}function t(e){for(var o=[],t=n(e),r=0,f=t.length;r<f;r++)o.push("%"+("00"+t[r].charCodeAt(0).toString(16)).slice(-2));return decodeURIComponent(o.join(""))}export{t as decode,o as encode};

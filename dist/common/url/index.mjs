/* eslint-disable */
var t=/\\/g,e=/^([a-z]+[a-z\d]*\:)?(\/*)/i,s=/^(?:([^:/]+)(?:\:([^/]+))?@)?(?:([^/@]+?)(?:\:(\d+))?)(\/[^]*)?$/,h={"http:":1,"https:":1,"ftp:":1,"file:":1,"ws:":1,"wss:":1},i="undefined"!=typeof location?location:{protocol:"http:",hostname:"localhost",port:"",pathname:"/"};class UrlParsed{constructor(o){var r,a,l="";(r=(o=o.trim()).indexOf("#"))>-1&&((a=o.slice(r)).length>2&&(l=a),o=o.slice(0,r)),this.hash=l;var n="";(r=o.indexOf("?"))>-1&&((a=o.slice(r)).length>2&&(n=a),o=o.slice(0,r)),this.search=n;var c="/",p=(a=(o=o.replace(t,"/")).match(e))[2],f=a[1],g="",m="",d="",u="",w="",v="null",x="",O=!1;f?(f=f.toLowerCase(),h.hasOwnProperty(f)?"file:"===f?(c+=o.slice(a[0].length),v="file://",x=f+(2===p.length?"/":"//")):O=!0:(c=o.slice(f.length),x=f)):(f=i.protocol,p.length<2?(c=o?("/"===o[0]?"":"/")+o:i.pathname,x=v=f+"//"+(w=(d=i.hostname)+((u=i.port)?":"+u:""))):O=!0),O&&((a=o.slice(a[0].length).match(s))&&(c=a[5]||c,v=f+"//"+(w=(d=a[3]||"")+((u=a[4]||"")?":"+u:"")),g=a[1]||"",m=a[2]||""),x=(g?g+(m?":"+m:"")+"@":"")+f+"//"+w),this.pathname=c,this.protocol=f,this.username=g,this.password=m,this.hostname=d,this.port=u,this.host=w,this.origin=v,this.href=x+c+n+l}toString(){return this.href}}export{UrlParsed};

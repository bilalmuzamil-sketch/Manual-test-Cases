import fs from 'fs';
const CK=JSON.parse(fs.readFileSync('/tmp/filters-viu/cookies.json','utf8'));
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36';
const r=await fetch('https://'+CK.host+'/index.html',{headers:{'User-Agent':UA,'Cache-Control':'no-cache'}});
const b=await r.text();
const m=b.match(/<meta name="app-version" content="([^"]+)"/);
const out={when:new Date().toISOString(),status:r.status,appVersion:m?m[1]:null,lastModified:r.headers.get('last-modified'),etag:r.headers.get('etag')};
console.log(JSON.stringify(out));
fs.writeFileSync(process.argv[2]||'/tmp/frc/obs/marker.json',JSON.stringify(out,null,1));

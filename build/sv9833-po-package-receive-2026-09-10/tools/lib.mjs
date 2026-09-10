import fs from 'fs';
export const UA='Mozilla/5.0';
const mk=p=>Object.entries(JSON.parse(fs.readFileSync(p,'utf8'))).map(([k,v])=>`${k}=${v}`).join('; ');
export const QA={name:'sv9833',app:'https://sv9833.qa.shopview.com',api:'https://sv9833api.qa.shopview.com',ck:mk('/tmp/sv9833/cookies.json')};
export const STG={name:'staging',app:'https://app.staging.shopview.com',api:'https://api.staging.shopview.com',ck:mk('/tmp/sv9833/stg-cookies.json')};
export async function marker(e){
  const r=await fetch(e.app+'/index.html');const t=await r.text();
  return {http:r.status,v:(t.match(/app-version" content="([^"]*)"/)||[])[1],lm:r.headers.get('last-modified'),etag:r.headers.get('etag')};
}
export async function sess(e,key='admin'){
  const r=await fetch(e.api+'/api/quick-login',{method:'POST',redirect:'manual',headers:{'Cookie':e.ck,'User-Agent':UA,'Content-Type':'application/json','Origin':e.app,'Referer':e.app+'/'},body:JSON.stringify({key})});
  const m=(r.headers.get('set-cookie')||'').match(/PHPSESSID=([^;]+)/);
  const p=e.ck.split('; ').filter(x=>!x.startsWith('PHPSESSID='));if(m)p.unshift('PHPSESSID='+m[1]);
  return {st:r.status,H:{'Cookie':p.join('; '),'User-Agent':UA,'Accept':'application/json','Origin':e.app,'Referer':e.app+'/','Content-Type':'application/json'}};
}
export const j=async(e,H,p,m='GET',b=null)=>{
  const o={method:m,headers:H}; if(b)o.body=JSON.stringify(b);
  const r=await fetch(e.api+p,o);const t=await r.text();
  try{return{s:r.status,b:JSON.parse(t)}}catch{return{s:r.status,b:t.slice(0,200)}}
};

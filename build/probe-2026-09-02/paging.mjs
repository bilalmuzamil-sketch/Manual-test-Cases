import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get = path => p.evaluate(async u => {
  const r=await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch(_){}
  return {status:r.status,json:j};
}, API+path);
const probe = async q => {
  const r = await get('/api/work-orders'+q);
  const w = r.json?.data?.work_orders;
  return `${q.padEnd(46)} ${r.status} n=${Array.isArray(w)?w.length:'-'} first=${Array.isArray(w)&&w[0]?w[0].number:'-'} pag=${JSON.stringify(r.json?.data?.pagination)}`;
};
for (const q of ['', '?page=2', '?pagination[page]=2', '?pagination[rowsPerPage]=500',
                 '?limit=500', '?rowsPerPage=500', '?perPage=500', '?offset=100',
                 '?pagination[page]=2&pagination[rowsPerPage]=100']) {
  console.log(await probe(q));
}
await b.close();

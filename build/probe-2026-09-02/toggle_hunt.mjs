// "Estimate / Invoice" is quoted by 89 cases as a toggle above the document, and a full 611-chunk
// sweep did not find it. Either it is assembled from pieces at runtime, or the wording is wrong.
// This looks at the invoice chunks for the toggle's actual option labels.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(90000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get=u=>p.evaluate(async x=>{const r=await fetch(x,{credentials:'include'});return r.ok?await r.text():'';},u);
const CHUNKS=['Invoice.BUbxjRL5.js','InvoiceDetails.C32SbinO.js','InvoiceContentSettings.Cvu7znOs.js',
              'InvoiceActionBar.B3tcWJNu.js'];
for (const c of CHUNKS) {
  const js = await get(`${APP}/js/${c}`);
  if (!js) { console.log(`\n### ${c}: could not fetch`); continue; }
  console.log(`\n### ${c} (${js.length} bytes)`);
  const near = [...js.matchAll(/.{55}Estimate.{55}/g)].map(m=>m[0].replace(/\s+/g,' ')).slice(0,6);
  near.forEach(s=>console.log('   …'+s+'…'));
  for (const n of ['Payment Receipt','Credit Memo','Document','Remit To','Remit Payment','B&W','Authorizer'])
    if (js.includes(n)) console.log(`   contains ${JSON.stringify(n)}`);
}
await b.close();

import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const path = process.argv[2] || '/workorders';
const { browser, page } = await boot2(process.env.SV_KEY||'admin', {});
const reqs=[];
page.on('request', r=>{ const u=r.url(); if(u.includes('/api/')) reqs.push(r.method()+' '+u.replace('https://api.staging.shopview.com','')); });
await page.goto('https://app.staging.shopview.com'+path, { waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(7000);
const url = page.url();
// capture filter bar text + buttons + chips
const info = await page.evaluate(()=>{
  const txt = (el)=> (el?.textContent||'').replace(/\s+/g,' ').trim();
  const out={ bodyLen: document.body.innerText.length };
  // find elements with data-test-id containing filter
  const dt=[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/filter|chip|status|customer|clear|collapse|assign|search/i.test(x));
  out.dataTestIds=[...new Set(dt)].slice(0,60);
  // buttons visible
  out.buttons=[...document.querySelectorAll('button')].map(b=>txt(b)).filter(t=>t&&t.length<40).slice(0,60);
  // top-of-page chips-like
  out.pageText = document.body.innerText.slice(0,1200);
  return out;
});
console.log('URL', url);
console.log('DATATESTIDS', JSON.stringify(info.dataTestIds));
console.log('BUTTONS', JSON.stringify(info.buttons));
console.log('---PAGETEXT---'); console.log(info.pageText);
console.log('---APIREQS---'); console.log([...new Set(reqs)].join('\n'));
await browser.close();

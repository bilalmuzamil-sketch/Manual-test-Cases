import fs from 'fs';
const {chromium}=(await import('/opt/node22/lib/node_modules/playwright/index.js')).default;
const port=fs.readFileSync('/tmp/qa10628/port.txt','utf8').trim(); const C=JSON.parse(fs.readFileSync('/tmp/qa10628/cookies.json')); const out={};
const b=await chromium.launch({args:['--proxy-server=http://127.0.0.1:'+port,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await b.newContext({viewport:{width:1600,height:1000},ignoreHTTPSErrors:true}); await ctx.addCookies(Object.entries(C).map(([name,value])=>({name,value,domain:'.qa.shopview.com',path:'/'})));
const p=await ctx.newPage(); await p.goto('https://sv10628.qa.shopview.com/login',{waitUntil:'domcontentloaded',timeout:120000}); await p.waitForTimeout(5000);
await p.click('[data-test-id="button_quick_login_tech"]'); await p.waitForURL(u=>!/login/.test(u.toString()),{timeout:60000}); await p.waitForTimeout(4000);
for(const q of ['209','P2-206','P2-243','P2-247','P2-162','P2-147']){
  await p.click('[data-test-id="global_search_trigger"]'); await p.waitForTimeout(1500);
  const inp=p.locator('.q-dialog input, [role=dialog] input').first(); await inp.fill(''); await inp.pressSequentially(q,{delay:120}); await p.waitForTimeout(5000);
  await p.evaluate(()=>{const t=[...document.querySelectorAll('.q-dialog .q-tab, .q-dialog button')].find(e=>/^Part sales/.test(e.innerText.trim())); t&&t.click();}); await p.waitForTimeout(1500); out[q]={tabs:await p.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-tab, [role=dialog] [role=tab], .q-dialog button')].map(e=>e.innerText.trim().replace(/\s+/g,' ')).filter(t=>/Part sales/.test(t))), items:await p.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-item, [role=dialog] [role=option]')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,90)).slice(0,5))};
  await p.screenshot({path:'gs-'+q+'.png'});
  if(q==='P2-209'){ const it=p.locator('.q-dialog .q-item, [role=dialog] [role=option]').filter({hasText:'P2-209'}).first(); out.clickable=await it.count(); if(out.clickable){ await it.click(); await p.waitForTimeout(4000); out.landed=p.url(); out.status=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText); } }
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
}
fs.writeFileSync('gs.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out,null,1)); await b.close();

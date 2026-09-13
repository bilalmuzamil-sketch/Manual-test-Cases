// PRODUCTION -- C53568. The import created nothing. Read the SERVER'S OWN RESPONSE to find out why,
// instead of guessing at my CSV a second time. Try two date formats and capture each reply.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568', attempts:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR66.json`, JSON.stringify(R,null,1));
const HEAD='*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title - What are you doing,Line Description - Why are you doing it,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount';
const mk=(date,tag)=>`${HEAD}
Trucks Hill 2,aqeel transport 56,,,,,,,,,${tag},${date},,Bilal Muzammil,Labor,ZZAUTOTEST imported labour,Seeded for design testing,,,,2,100.00,200.00,10.00
Trucks Hill 2,aqeel transport 56,,,,,,,,,${tag},${date},,Bilal Muzammil,Part,ZZAUTOTEST imported part,Seeded for design testing,,ZZPART1,ZZAUTOTEST part,1,50.00,50.00,2.50
`;
const { browser, page } = await bootProdLogin('/');
let cap=[];
page.on('response', async r=>{ if(/\/api\/imports\//.test(r.url())){
  try{ cap.push({url:r.url().split('api.shopview.com')[1], s:r.status(), body:(await r.text()).slice(0,900)}); }catch(e){} }});
for(const [date,tag] of [['09/13/2026','ZZAUTOTEST-IMP-A'],['2026-09-13','ZZAUTOTEST-IMP-B']]){
  const f=`/tmp/claude-0/imp-${tag}.csv`; fs.writeFileSync(f, mk(date,tag));
  cap=[];
  await page.goto(`${APP}/administration/invoices-import`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(12000);
  const input=await page.$('[data-test-id="file_upload"]');
  if(!input){ L('no file input'); break; }
  await input.setInputFiles(f);
  await page.waitForTimeout(8000);
  await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const b=[...document.querySelectorAll('button')].filter(ok).find(x=>/^import invoices$/i.test((x.innerText||'').trim()));
    if(b&&!b.disabled) b.click();});
  await page.waitForTimeout(15000);
  await page.screenshot({path:`${EV}/PR66-${tag}.png`, fullPage:true});
  const screen=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return (t.match(/(imported|created|skipped|error|invalid|missing|failed|success)[^.]{0,160}/ig)||[]).slice(0,4);});
  R.attempts.push({date, tag, responses:cap.map(c=>({url:c.url, s:c.s, body:c.body})), screen});
  L('--- %s (date %s)', tag, date);
  for(const c of cap) L('    %s -> %s | %s', c.url, c.s, c.body.slice(0,400));
  L('    screen says: %s', JSON.stringify(screen));
  save();
}
save(); await browser.close();

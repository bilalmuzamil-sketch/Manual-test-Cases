// PRODUCTION -- how does a work order become Complete? The badge is not a menu and the work-order
// kebab offers only Audit Log / Timesheets. Enumerate every control on every tab of an Approved
// work order and report what is actually there, rather than guessing a third time.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com';
const WO={n:'S2-849', id:'d7ba2cfd-896c-46b3-b451-ea11815b294f'};
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), tabs:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR55.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
for(const tab of ['lines','details','finance','tasks']){
  await page.goto(`${APP}/workorders/${WO.id}/${tab}`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(11000);
  const d=await page.evaluate((n)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {url:location.href, onRecord:t.includes(n),
      tabs:[...document.querySelectorAll('[data-test-id^="tab_"]')].filter(ok).map(e=>e.getAttribute('data-test-id')),
      controls:[...document.querySelectorAll('button,[role=button],[data-test-id]')].filter(ok)
        .map(e=>({tid:e.getAttribute('data-test-id')||null, txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,32),
                  dis:e.disabled===true}))
        .filter(x=>x.tid||x.txt).slice(0,70)};}, WO.n);
  R.tabs[tab]={url:d.url, onRecord:d.onRecord, tabs:d.tabs};
  const interesting=d.controls.filter(c=>/status|complete|finish|close|done|approve|start|ready|review/i.test(`${c.tid} ${c.txt}`));
  R.tabs[tab].interesting=interesting;
  L('%s onRecord=%s | status-ish: %s', tab, d.onRecord, JSON.stringify(interesting));
  if(tab==='lines') R.tabs[tab].all=d.controls;
  await page.screenshot({path:`${EV}/PR55-${tab}.png`, fullPage:true});
  save();
}
L('tabs available: %s', JSON.stringify(R.tabs.lines.tabs));
L('all lines-tab controls: %s', JSON.stringify((R.tabs.lines.all||[]).map(c=>c.tid||c.txt).slice(0,60)));
save(); await browser.close();

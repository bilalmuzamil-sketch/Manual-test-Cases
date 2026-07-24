// drive-ui.mjs — hydrate SPA as the currently-reassigned qa_reassign user (via switch-user)
// and observe control presence + enabled state across WO/parts/settings pages.
// Usage: node drive-ui.mjs <roleLabelSlug>
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api, switchUser } from './lib.mjs';
const { chromium } = pw;
const APP='https://app.staging.shopview.com';
const QA_UID='01221b93-47b1-497f-bf74-30601453a469';
const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a'; // Heavy Duty (where the WOs live)
const slug = process.argv[2] || 'role';
const EVID='evidence/';

const APPROVED_WO='bd159aeb-c7e4-4e81-98c1-004d321950ce'; // S9-25036 approved, 4 lines
const REVIEW_WO='0ea47d7d-db10-4108-883b-71d295fe1e34';   // S9-24011 ready_for_review
const RECV_WO='04473e90-2369-4197-92a1-2227143bca2e';     // S9-25247 approved, unrecv 4

const l = await login('admin');
const sw = await switchUser(l.sessCookie, QA_UID);
if (sw.status!==200){ console.log('SWITCH_FAIL',sw.status); process.exit(3); }
await api(l.sessCookie,'POST','/api/iam/change-location',{workplace_id:WP,workplace_timezone:'America/Edmonton'});
const fe = await api(l.sessCookie,'GET','/api/auth/me/fe-permissions');
const feData = fe.body?.data;
const perms = feData?.fe_permissions||[];
console.log('ROLE', slug, 'perms', perms.length, 'view_mode', feData?.view_mode);
const userObj = { data: sw.body?.data || sw.body };
const cookies = l.sessCookie.split('; ').map(p=>{const i=p.indexOf('=');return {name:p.slice(0,i),value:p.slice(i+1),domain:'.staging.shopview.com',path:'/'};});
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless:true, proxy:{server:process.env.HTTPS_PROXY}, args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ viewport:{width:1600,height:1000}, ignoreHTTPSErrors:true });
await ctx.addCookies(cookies);
const page = await ctx.newPage();
await page.goto(APP+'/login',{waitUntil:'domcontentloaded',timeout:60000});
await page.evaluate(({u,f})=>{ localStorage.setItem('user',JSON.stringify(u)); localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f)); if(u.data&&u.data.token) localStorage.setItem('token',JSON.stringify(u.data.token)); },{u:userObj,f:feData});
await page.waitForTimeout(400);

async function scan(name, dest, wantButtons){
  await page.goto(APP+dest,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5500);
  const url = page.url();
  const body = (await page.locator('body').innerText().catch(()=>'')).replace(/\n+/g,' | ');
  // detect visible buttons and enabled state
  const btns = await page.evaluate(()=>{
    const out=[];
    for (const el of document.querySelectorAll('button, a[role="button"], .q-btn')){
      const cs=getComputedStyle(el);
      const r=el.getBoundingClientRect();
      const visible = cs.display!=='none' && cs.visibility!=='hidden' && cs.opacity!=='0' && r.width>0 && r.height>0;
      if(!visible) continue;
      const t=(el.innerText||el.textContent||'').trim().replace(/\s+/g,' ');
      if(!t) continue;
      const disabled = el.disabled || el.getAttribute('aria-disabled')==='true' || el.classList.contains('disabled') || el.classList.contains('q-btn--disable') || cs.pointerEvents==='none';
      out.push({t:t.slice(0,40), disabled});
    }
    return out;
  });
  const found={};
  for(const w of wantButtons){
    const hit=btns.find(b=>b.t.toLowerCase().includes(w.toLowerCase()));
    found[w]= hit? (hit.disabled?'PRESENT(disabled)':'PRESENT(enabled)') : 'ABSENT';
  }
  const shot=EVID+slug+'_'+name+'.png';
  await page.screenshot({path:shot,fullPage:false});
  console.log('  ['+name+']', url.replace(APP,''), '=>', JSON.stringify(found));
  return {name,url:url.replace(APP,''),wanted:found,bodyHead:body.slice(0,180),allButtons:btns.map(b=>b.t+(b.disabled?'(x)':'')).slice(0,40)};
}

const res={role:slug,perms:perms.length,view_mode:feData?.view_mode,pages:[]};
res.pages.push(await scan('approvedWO','/workorders/'+APPROVED_WO+'/lines',['Complete','Send to Review','Receive','Order','New Line','Add Part','Request Part']));
res.pages.push(await scan('reviewWO','/workorders/'+REVIEW_WO+'/lines',['Mark Reviewed','Complete','Reviewed','Send to Review']));
res.pages.push(await scan('recvWO','/workorders/'+RECV_WO+'/lines',['Receive','Order','Accept','New Line','Add Part']));
res.pages.push(await scan('partsOrders','/parts/orders',['New Purchase Order','Receive','New PO','Create','New Part']));
res.pages.push(await scan('settings','/administration/settings',['Save','Work Orders']));
fs.writeFileSync(EVID+slug+'_scan.json', JSON.stringify(res,null,1));
await browser.close();
console.log('DONE', slug);

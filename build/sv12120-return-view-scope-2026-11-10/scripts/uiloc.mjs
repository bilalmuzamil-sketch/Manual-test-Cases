import {sess} from './common.mjs'; import fs from 'fs';
const EV='../ev'; const s=await sess(); const p=s.page; const net=[];
p.on('response',r=>{ if(/\/api\/inventory\/returns\/[^?]/.test(r.url())) net.push({t:Date.now(),st:r.status(),u:r.url().replace(/^https:\/\/[^/]+/,'')}); });
const A='343cd292-e692-450f-914f-a1878639e073', L='2dba7fe7-207c-4cdb-a5cd-8795837cdb52';
const hdr=()=>p.evaluate(()=>document.querySelector('header')?.innerText.replace(/\s+/g,' ')||'');
async function switchTo(name){
  await s.go('/workorders'); await p.waitForTimeout(5000);
  await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1500);
  const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(x=>x.innerText.replace(/\s+/g,' ')));
  const sel=await p.$('[data-test-id="select_location"]');
  if(!sel){ const it=await p.$('.q-menu .q-item:has-text("Change Location")'); if(it) await it.click(); await p.waitForTimeout(1500); }
  const sl=await p.$('[data-test-id="select_location"]'); const b=await sl.boundingBox();
  await p.mouse.click(b.x+b.width-30,b.y+b.height/2); await p.waitForTimeout(1500);
  const opt=await p.$(`.q-menu .q-item:has-text("${name}")`); await opt.click(); await p.waitForTimeout(6000);
  return {items, header:await hdr()};
}
const res={};
res.sw1=await switchTo('Staging Lethbridge - 4310');
await s.go('/parts/return/'+A); await p.waitForTimeout(6000); res.hdA=await hdr();
res.screenA=await p.evaluate(()=>document.querySelector('main')?.innerText.replace(/\s+/g,' ').slice(0,300));
await p.screenshot({path:EV+'/05-lethbridge-selected-opens-heavyduty-return.png'});
await s.go('/parts/return/'+L); await p.waitForTimeout(6000);
res.screenL=await p.evaluate(()=>document.querySelector('main')?.innerText.replace(/\s+/g,' ').slice(0,300));
await p.screenshot({path:EV+'/06-lethbridge-own-return.png'});
res.sw2=await switchTo('Staging Heavy Duty - 9919');
await s.go('/parts/return/'+A); await p.waitForTimeout(6000);
res.screenA2=await p.evaluate(()=>document.querySelector('main')?.innerText.replace(/\s+/g,' ').slice(0,200));
res.net=net.map(x=>[x.st,x.u]);
fs.writeFileSync(EV+'/uiloc.json',JSON.stringify(res,null,1)); console.log(JSON.stringify(res,null,1));
await s.close(); process.exit(0);

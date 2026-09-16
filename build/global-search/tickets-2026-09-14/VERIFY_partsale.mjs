// SV-10031 says creating a part sale throws a server error and then will not open. It is sitting at
// QA Complete, so before a word of it is restated it has to be tried on the build as it stands.
// Rewriting a report from its own old text is how a fixed fault gets handed to engineering twice.
//
// Done through the SCREEN, not an API call: the report is about what a person sees after pressing
// Save, and an API that answers 200 would say nothing about the two red messages.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/sv10031`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/SV10031-CHECK.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP, version } = await boot('sv9160','/','admin');
R.build=version; L('build', version);
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j};}catch(e){return {error:String(e).slice(0,110)};}},[`https://${APIH}${p}`,m,b]);
{ const wps=await api('/api/staff/my-workplaces');
  const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const hd=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'});
  R.workplace=hd&&hd.name; }

await page.goto(`${APP}/parts/part-sales`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.listBefore=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')]
  .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)).slice(0,4));
L('the list opens, first rows:', JSON.stringify(R.listBefore).slice(0,200));
await page.screenshot({path:`${EV}/01-list-before.png`});

// press the button the report names
const opened=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,a')]
  .find(e=>/new part sale/i.test((e.innerText||'').trim())); if(!b) return false; b.click(); return true;});
await page.waitForTimeout(6000);
R.dialogOpened=opened;
R.dialogText=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')]
  .filter(e=>e.getBoundingClientRect().width>2).pop(); return d?(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,220):null;});
L('New Part Sale dialog opened:', opened, '|', (R.dialogText||'').slice(0,120));
await page.screenshot({path:`${EV}/02-dialog.png`});

// choose a customer the way a person would: open the picker, type, take the first row
const picked=await page.evaluate(async()=>{
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(e=>e.getBoundingClientRect().width>2).pop();
  if(!d) return {error:'no dialog'};
  const sel=d.querySelector('.q-select,[role=combobox]'); if(!sel) return {error:'no customer picker'};
  sel.click(); return {ok:true};});
await page.waitForTimeout(3000);
await page.keyboard.type('4 Star Truck Repair',{delay:60});
await page.waitForTimeout(6000);
const chose=await page.evaluate(()=>{const it=[...document.querySelectorAll('.q-menu .q-item,[role=option]')]
  .filter(e=>e.getBoundingClientRect().width>2)[0]; if(!it) return null;
  const t=(it.innerText||'').replace(/\s+/g,' ').trim().slice(0,50); it.click(); return t;});
await page.waitForTimeout(3000);
R.customerChosen=chose; L('customer chosen:', chose);
await page.screenshot({path:`${EV}/03-customer-chosen.png`});

// Save
const saved=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')]
  .filter(e=>e.getBoundingClientRect().width>2).pop(); if(!d) return false;
  const b=[...d.querySelectorAll('button')].find(e=>/^save$/i.test((e.innerText||'').trim())); if(!b) return false;
  b.click(); return true;});
await page.waitForTimeout(12000);
R.savePressed=saved;
const after=await page.evaluate(()=>({
  url:location.pathname,
  notifications:[...document.querySelectorAll('.q-notification,[role=alert],.q-banner')]
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,6),
  bodyMentionsError:/Ooooops|an error occurred|doesn.t exist/i.test(document.body.innerText||'')}));
R.afterSaving=after;
await page.screenshot({path:`${EV}/04-after-save.png`});
L('after pressing Save -> page', after.url);
L('  messages on screen:', JSON.stringify(after.notifications).slice(0,300));
L('  any error wording on the page:', after.bodyMentionsError);
R.stillHappens = after.bodyMentionsError || after.notifications.some(t=>/Ooooops|doesn.t exist/i.test(t));
R.openedTheNewPartSale = /part-sale\//.test(after.url);
L('=> does the report still describe the product?', R.stillHappens ? 'YES - it still errors' :
   (R.openedTheNewPartSale ? 'NO - it saved and opened the new part sale' : 'NO error seen; check the screenshot'));
save(); L('DONE'); await browser.close();

// The six cases the handoff asks for, run exactly as their own steps are written - the queries are
// read out of the case text, not remembered - plus the timing case whose recorded result today's
// measurement contradicts.
//
// Every check looks for THE NAMED RECORD inside the right group, never at a count. A count told me
// twice this week that something had been found when what came back was a different record that
// merely matched on its name.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/run-six`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), cases:{}};
const save=()=>fs.writeFileSync(`${DIR}/RUN-SIX.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
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
  R.workplace=hd&&hd.name; L('workplace:',R.workplace); }

const ask=async(q,group,shot)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3200);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:35});
  await page.waitForTimeout(10000);
  if(group){ await page.evaluate((g)=>{const e=document.querySelector(`[data-test-id="search_modal_tab_${g}"]`); e&&e.click();},group);
    await page.waitForTimeout(5000); }
  const m=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')]
      .filter(e=>e.getBoundingClientRect().width>2).pop();
    const tabs={}; d&&d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
      const x=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=x?+x[1]:null;});
    return {tabs, rows:[...document.querySelectorAll('[data-test-id^="search_result_row_"]')]
      .map(e=>({type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
        text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,90)}))};});
  if(shot) await page.screenshot({path:`${EV}/${shot}.png`});
  const inGroup=(m.rows||[]).filter(r=>!group||r.type===group);
  return {typed:q, group, count:(m.tabs||{})[group||'all'], rows:inGroup.map(r=>r.text).slice(0,6)};
};
const has=(r,name)=>r.rows.some(t=>t.toLowerCase().includes(name.toLowerCase()));

// ---- C55662  the company's own phone -------------------------------------------------
{ const a=await ask('419-555-0143','customers','C55662-whole');
  const b=await ask('555-0143','customers','C55662-part');
  const whole=has(a,'ZZAUTOTEST Bridgeport Hauling'), part=has(b,'ZZAUTOTEST Bridgeport Hauling');
  R.cases.C55662={test:2977474, steps:[a,b], wholeNumberFound:whole, partOfNumberFound:part,
    verdict: whole&&part ? 'Passed' : 'Failed',
    why: whole&&!part ? 'the whole number returns the customer and only the last part of it returns nothing - exactly the known problem SV-10057, so nothing new is raised'
        : whole&&part ? 'both searches returned the customer, so the fix has shipped'
        : 'it failed in a way the case did not predict - the whole number did not return the customer either'};
  L('C55662 whole:',whole,'part:',part,'=>',R.cases.C55662.verdict); save(); }

// ---- C53605  year and make together --------------------------------------------------
{ const a=await ask('2019 Freightliner','assets','C53605');
  const found=has(a,'2019 Freightliner Cascadia');
  R.cases.C53605={test:2959371, steps:[a], found, verdict: found?'Passed':'Failed',
    why: found?'the vehicle came back, so the fix has shipped'
              :'the Assets group came back empty - exactly the known problem SV-10055, so nothing new is raised'};
  L('C53605 vehicle found:',found,'=>',R.cases.C53605.verdict); save(); }

// ---- C55664  the model on its own ----------------------------------------------------
{ const a=await ask('Cascadia','assets','C55664');
  const found=has(a,'Cascadia');
  R.cases.C55664={test:2977476, steps:[a], found, verdict: found?'Passed':'Failed',
    why: found?'the vehicle came back under Assets when its model was typed':'no vehicle came back for its model'};
  L('C55664 model found:',found,'=>',R.cases.C55664.verdict); save(); }

// ---- C55670  a contact's name and own number -----------------------------------------
{ const a=await ask('Marlene','customers','C55670-first');
  const b=await ask('Okonkwo','customers','C55670-last');
  const c=await ask('419-555-0177','customers','C55670-whole');
  const d=await ask('555-0177','customers','C55670-part');
  const N='ZZAUTOTEST Bridgeport Hauling';
  const r={first:has(a,N), last:has(b,N), whole:has(c,N), part:has(d,N)};
  const all=Object.values(r).every(Boolean);
  R.cases.C55670={test:2980692, steps:[a,b,c,d], found:r, verdict: all?'Passed':'Failed',
    why: all?'the contact\'s first name, last name, whole number and the last part of it each returned the customer'
            :'one or more of the four searches did not return the customer'};
  L('C55670',JSON.stringify(r),'=>',R.cases.C55670.verdict); save(); }

// ---- C53579  the job number in five forms --------------------------------------------
{ const seed=await ask('ZZAUTOTEST','work_orders','C53579-seed');
  const num=(seed.rows.join(' ').match(/S9160-(\d{4,6})/)||[]);
  const tail=num[1];
  if(!tail){ R.cases.C53579={test:2959356, verdict:'Blocked', why:'no seeded job number could be read, so the five forms had nothing to be built from', seed}; }
  else {
    const forms=[`S-${tail}`,`S${tail}`,`S9160${tail}`,`S9160-${tail}`,`9160-${tail}`];
    const out=[]; for(const f of forms) out.push(await ask(f,'work_orders','C53579-'+f.replace(/\W/g,'')));
    const hit=out.map(o=>o.rows.some(t=>t.includes(tail)));
    const all=hit.every(Boolean);
    R.cases.C53579={test:2959356, jobNumber:`S9160-${tail}`, forms, steps:out, foundEachForm:hit,
      verdict: all?'Passed':'Failed',
      why: all?'all five ways of writing the job number found the same job'
              :`these forms found nothing: ${forms.filter((f,i)=>!hit[i]).join(', ')}`};
    L('C53579 forms',JSON.stringify(forms),'hits',JSON.stringify(hit),'=>',R.cases.C53579.verdict); }
  save(); }

// ---- C53604  address line 2 -----------------------------------------------------------
{ const a=await ask('Dock 7B','customers','C53604-customer');
  const b=await ask('Bay 12C','vendors','C53604-vendor');
  const cust=has(a,'ZZAUTOTEST Bridgeport Hauling'), vend=has(b,'ZZAUTOTEST Kestrel');
  R.cases.C53604={test:2959370, steps:[a,b], customerFound:cust, vendorFound:vend,
    verdict: cust&&vend?'Passed':'Failed',
    why: cust&&vend?'both address line 2 values returned their record'
        : `${cust?'':'the customer half returned nothing. '}${vend?'':'the supplier half returned nothing.'}`};
  L('C53604 customer:',cust,'supplier:',vend,'=>',R.cases.C53604.verdict); save(); }

L('DONE'); await browser.close();

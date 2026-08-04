// (a) PV screen headers (retry, longer wait) (b) Column Selection panel contents + default state
// (c) the SINGLE-LOCATION observation with a CLEAN browser profile (the B34 confounder)
import fs from 'fs';
import { boot, api, APP } from './boot.mjs';
const OUT=new URL('../evidence/screen/',import.meta.url).pathname;
fs.mkdirSync(OUT,{recursive:true});
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const res={build:'v3.4.1-3d03023',at:new Date().toISOString()};

async function headersOf(page,slug,wait=16000){
  await page.goto(APP+'/reports/'+slug,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(wait);
  return await page.evaluate(()=>{
    const txt=e=>(e.innerText||'').trim().replace(/\s+/g,' ');
    const vis=e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0;};
    const main=document.querySelector('main')||document.body;
    const t=Array.from(main.querySelectorAll('table')).filter(vis)[0];
    const clean=s=>s.replace(/arrow_drop_(up|down)/g,'').replace(/keyboard_double_arrow_down/g,'')
                    .replace(/info_outline/g,'').replace(/arrow_(upward|downward)/g,'').trim();
    const rows=t?Array.from(t.querySelectorAll('thead tr')).map(tr=>
      Array.from(tr.querySelectorAll('th,td')).map(th=>clean(txt(th)))):[];
    return {headerRows:rows, bodyRows:t?t.querySelectorAll('tbody tr').length:0,
            hasLocationHeader: rows.length?rows[rows.length-1].includes('Location'):null};
  });
}

// ---------- PASS 1: default profile, PV retry + column selector ----------
{
  const {browser,page}=await boot();
  res.pv = await headersOf(page,'parts-velocity',20000);
  console.log('PV screen headers:',JSON.stringify(res.pv.headerRows.slice(-1)[0]||[]));
  await page.screenshot({path:OUT+'parts-velocity-retry.png'});

  // Column Selection panel, per report: what it offers and what is ON by default
  res.columnSelectors={};
  for(const slug of ['work-in-progress','inventory-value','parts-velocity','sales-by-customer','technician-utilization','sales-by-representative']){
    await page.goto(APP+'/reports/'+slug,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(12000);
    const opened=await page.evaluate(()=>{
      const vis=e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0;};
      const btns=Array.from(document.querySelectorAll('button,.q-btn,[role=button]')).filter(vis);
      const b=btns.find(x=>{
        const a=(x.getAttribute('aria-label')||'')+' '+(x.getAttribute('title')||'')+' '+(x.innerText||'');
        return /column/i.test(a);});
      if(b){b.click();return true;} return false;});
    await page.waitForTimeout(2500);
    const panel=await page.evaluate(()=>{
      const txt=e=>(e.innerText||'').trim().replace(/\s+/g,' ');
      const vis=e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0;};
      const menus=Array.from(document.querySelectorAll('.q-menu,.q-dialog,[role=menu],[role=dialog]')).filter(vis);
      const m=menus[menus.length-1];
      if(!m) return null;
      const toggles=Array.from(m.querySelectorAll('.q-toggle,.q-checkbox,[role=switch],[role=checkbox]')).filter(vis)
        .map(t=>({label:txt(t), on:(t.getAttribute('aria-checked')==='true')||t.classList.contains('q-toggle--truthy')||
                    !!t.querySelector('input:checked')}));
      return {panelText:txt(m).slice(0,1200), toggles};
    });
    res.columnSelectors[slug]={opened,panel};
    console.log('--- colsel',slug,'opened',opened,'toggles',panel?panel.toggles.length:0);
    if(panel) panel.toggles.forEach(t=>console.log('      ',t.on?'[ON ]':'[off]',t.label.slice(0,60)));
    await page.screenshot({path:OUT+'colsel-'+slug+'.png'});
  }
  await browser.close();
}

// ---------- PASS 2: CLEAN profile, scoped to ONE location (B18 / B34) ----------
{
  // scope the SESSION to a single workplace, then use a FRESH context (no persisted column state)
  const ch=await api('POST','/api/iam/change-location',{workplace_id:HD,workplace_timezone:'America/Edmonton'});
  console.log('change-location ->',ch.status);
  const {browser,page}=await boot({viewport:{width:1680,height:1050}});
  res.singleLocation={changeLocationStatus:ch.status,reports:{}};
  for(const slug of ['sales-by-customer','sales-by-representative','parts-velocity','technician-utilization','work-in-progress','inventory-value']){
    const h=await headersOf(page,slug,14000);
    // is a Location FILTER control still offered?
    const filt=await page.evaluate(()=>{
      const txt=e=>(e.innerText||'').trim().replace(/\s+/g,' ');
      const vis=e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0;};
      const main=document.querySelector('main')||document.body;
      const all=Array.from(main.querySelectorAll('.q-field,.q-select,button,.q-btn')).filter(vis).map(txt);
      return {locationFilterPresent: all.some(s=>/location/i.test(s)),
              matches: all.filter(s=>/location/i.test(s)).slice(0,5)};
    });
    res.singleLocation.reports[slug]={...h,...filt};
    console.log(`SINGLE ${slug.padEnd(24)} locHeader=${h.hasLocationHeader} locFilter=${filt.locationFilterPresent} ${JSON.stringify(filt.matches).slice(0,90)}`);
    await page.screenshot({path:OUT+'singleloc-'+slug+'.png'});
  }
  await browser.close();
}
fs.writeFileSync(OUT+'colsel-and-singleloc.json',JSON.stringify(res,null,1));
console.log('DONE');

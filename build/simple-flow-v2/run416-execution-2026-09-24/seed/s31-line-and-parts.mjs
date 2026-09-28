// Build a second line carrying parts that are ORDERABLE and carry CORES, which is the one combination
// still missing. Catalogue parts carry cores but arrive In Stock; asking for more than stock holds
// should push them to Auth To Order while keeping the core. Also add two plain orderable parts so a
// bulk order has something to group.
//   -> C44570 (declining returns only not-yet-arrived parts), C44579/C44580 (bulk order),
//      C53489 (a deferred part's core), C44605 (a second line to move a part to)
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const parts=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>/drag_indicator|Core/i.test(t.innerText||''))
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,105)));
const lines=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr[class*="line-row-"]')]
  .map(r=>({status:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()).join('+'),
    text:(r.innerText||'').replace(/\s+/g,' ').trim().slice(0,60),
    buttons:[...r.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean)})));
await openWo(page,WO); await page.waitForTimeout(9000);

// --- a fresh line ---
console.log('adding a line');
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>(e.innerText||'').trim()==='New Line'&&e.getBoundingClientRect().width); if(b)b.click();});
await page.waitForTimeout(5500);
const ins=page.locator('.q-dialog input:visible');
if(await ins.count()){ await ins.nth(0).click(); await ins.nth(0).type('ZZAUTOTEST parts line',{delay:35});
  if(await ins.count()>1){ await ins.nth(1).click(); await ins.nth(1).type('ZZAUTOTEST for the parts checks',{delay:35}); }
  await page.waitForTimeout(1200);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Save & Close$/i.test((x.innerText||'').replace(/\s+/g,' ').trim())); if(b)b.click();});
  await page.waitForTimeout(8000); }
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
// approve it so it can carry parts and be declined later
await page.evaluate(()=>{for(const r of document.querySelectorAll('tr[class*="line-row-"]')){
  const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Approve$/i.test((x.innerText||'').trim())); if(b){b.click();return;}}});
await page.waitForTimeout(5000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
R.lines=await lines();
console.log('lines now:'); R.lines.forEach(l=>console.log('   ',l.status||'(none)','|',l.text));

// --- add parts to the LAST line's Add Part ---
const addTo=async(spec)=>{
  const opened=await page.evaluate(()=>{const all=[...document.querySelectorAll('*')]
      .filter(x=>/^\+?\s*Add Part$/i.test((x.textContent||'').trim())&&x.getBoundingClientRect().width)
      .sort((a,b)=>b.getBoundingClientRect().y-a.getBoundingClientRect().y);   // the LAST line's
    if(!all.length)return 'no Add Part'; all[0].scrollIntoView({block:'center'}); all[0].click(); return 'opened';});
  if(opened!=='opened'){ console.log('   ',opened); return; }
  await page.waitForTimeout(4500);
  const fieldIx=async(src)=>await page.evaluate((s)=>{const re=new RegExp(s,'i');
    const i=[...document.querySelectorAll('input')].filter(x=>x.getBoundingClientRect().width);
    return i.findIndex(x=>re.test(((x.closest('.q-field')||{}).innerText||'')+' '+(x.getAttribute('placeholder')||'')));},src);
  const put=async(src,val,label)=>{const ix=await fieldIx(src); if(ix<0){console.log('      no',label);return;}
    const b=page.locator('input:visible').nth(ix); await b.click({timeout:9000}).catch(()=>{}); await b.fill('').catch(()=>{});
    await b.type(val,{delay:40}); console.log('      ',label,'=',val); await page.waitForTimeout(2300);};
  await put('Part number',spec.num,'part number');
  const sugg=await page.evaluate(()=>{const out=[];
    [...document.querySelectorAll('.q-menu,[role=listbox]')].filter(x=>x.getBoundingClientRect().width)
      .forEach(m=>[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
        .forEach(i=>{const r=i.getBoundingClientRect(); out.push({t:(i.innerText||'').replace(/\s+/g,' ').trim().slice(0,50),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)});}));
    return out.slice(0,6);});
  if(sugg.length && spec.catalogue){ await page.mouse.click(sugg[0].x,sugg[0].y); console.log('       took',JSON.stringify(sugg[0].t)); await page.waitForTimeout(3000); }
  else if(sugg.length){ await page.keyboard.press('Escape'); await page.waitForTimeout(800); }
  await put('Description',spec.desc,'description');
  await put('^Qty',spec.qty,'quantity');
  await put('Sell price',spec.sell,'sell price');
  const saved=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
      .find(e=>/^(Save|Add)$/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b)return 'no save'; b.click(); return 'saved';});
  console.log('      ',saved); await page.waitForTimeout(6000);
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(1000);
};
for(const spec of [{num:'A427',desc:'ZZAUTOTEST big qty core part',qty:'250',sell:'200',catalogue:true},
                   {num:'ZZAUTOTEST-VEND-1',desc:'ZZAUTOTEST vendor part one',qty:'2',sell:'40'},
                   {num:'ZZAUTOTEST-VEND-2',desc:'ZZAUTOTEST vendor part two',qty:'3',sell:'60'}]) {
  console.log('\n   adding',spec.num); await addTo(spec);
}
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.parts=await parts();
console.log('\nparts on the work order now:'); R.parts.forEach(p=>console.log('   ',p));
R.orderable=R.parts.filter(p=>/Auth To Order|Order/.test(p)).length;
R.cores=R.parts.filter(p=>/Core/i.test(p)).length;
console.log('\nparts that can be ordered:',R.orderable,'| core rows:',R.cores);
await page.screenshot({path:`${EV}/s31-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s31-line-parts.json`,JSON.stringify(R,null,1));
await browser.close();

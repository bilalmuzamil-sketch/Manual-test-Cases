// Build the data states the remaining checks need, on one work order:
//   - a part that carries a CORE (catalogue parts A428 / A158 do)          -> C53489, C44570, C44561
//   - parts that can be ORDERED, so purchase orders exist per vendor       -> C44579, C44580, C44586, C53487
//   - a second line, so a part can be moved between lines                  -> C44605
// Add Part is an inline row: Part number, Description*, Qty*, Category, Cost, Sell price*.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO=process.env.WOID||'281adfa7-5925-4718-936d-91d12cda3873';   // S2-917, approved, offers Add Part
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={added:[]};
const partRows=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .filter(t=>/drag_indicator|Core/i.test(t.innerText||''))
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,110)));
const openAddPart=async()=>await page.evaluate(()=>{const e=[...document.querySelectorAll('*')]
    .filter(x=>/^\+?\s*Add Part$/i.test((x.textContent||'').trim())&&x.getBoundingClientRect().width)
    .sort((a,b)=>a.getBoundingClientRect().y-b.getBoundingClientRect().y)[0];
  if(!e)return 'no Add Part'; e.scrollIntoView({block:'center'}); e.click(); return 'opened';});
const fieldIx=async(rx)=>await page.evaluate((src)=>{const re=new RegExp(src,'i');
  const ins=[...document.querySelectorAll('input')].filter(i=>i.getBoundingClientRect().width);
  return ins.findIndex(i=>re.test(((i.closest('.q-field')||{}).innerText||'')+' '+(i.getAttribute('placeholder')||'')));},rx.source);
const typeIn=async(rx,val,label)=>{const ix=await fieldIx(rx);
  if(ix<0){ console.log('     no field for',label); return false; }
  const box=page.locator('input:visible').nth(ix);
  await box.click({timeout:9000}).catch(()=>{}); await box.fill('').catch(()=>{});
  await box.type(val,{delay:45}); console.log('     typed',label,'=',val); await page.waitForTimeout(2500); return true;};

await openWo(page,WO); await page.waitForTimeout(9000);
R.before=await partRows();
console.log('parts before:'); R.before.forEach(p=>console.log('   ',p));

for (const spec of [{num:'A428',desc:'ZZAUTOTEST core part',qty:'1',cost:'25',sell:'50'},
                    {num:'A158',desc:'ZZAUTOTEST second core part',qty:'2',cost:'30',sell:'60'},
                    {num:'ZZAUTOTEST-PLAIN',desc:'ZZAUTOTEST plain part',qty:'1',cost:'10',sell:'20'}]) {
  console.log('\n--- adding',spec.num,'---');
  console.log('  ',await openAddPart()); await page.waitForTimeout(4500);
  await typeIn(/Part number/i,spec.num,'the part number');
  // a catalogue match may be offered - take it, since that is what carries a core
  const sugg=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu,[role=listbox]')].filter(x=>x.getBoundingClientRect().width);
    const out=[]; m.forEach(mm=>[...mm.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .forEach(i=>{const r=i.getBoundingClientRect(); out.push({t:(i.innerText||'').replace(/\s+/g,' ').trim().slice(0,60),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)});}));
    return out.slice(0,8);});
  console.log('     catalogue offers:',JSON.stringify(sugg.map(s=>s.t)));
  if(sugg.length){ await page.mouse.click(sugg[0].x,sugg[0].y); console.log('     took the catalogue match'); await page.waitForTimeout(3500); }
  await typeIn(/Description/i,spec.desc,'the description');
  await typeIn(/Qty/i,spec.qty,'the quantity');
  await typeIn(/\$ Cost/i,spec.cost,'the cost');
  await typeIn(/Sell price/i,spec.sell,'the sell price');
  const saved=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
      .find(e=>/^(Save|Add|Save Part|Add Part)$/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b)return 'no save control; nearby buttons: '+[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(-10).join(' | ');
    b.click(); return 'pressed '+(b.innerText||'').trim();});
  console.log('  ',saved); await page.waitForTimeout(6000);
  R.added.push({spec,saved});
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(1200);
}
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.after=await partRows();
console.log('\nparts after:'); R.after.forEach(p=>console.log('   ',p));
R.cores=R.after.filter(p=>/Core/i.test(p)).length;
console.log('\nrows that are cores:',R.cores);
await page.screenshot({path:`${EV}/s29-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s29-build-states.json`,JSON.stringify(R,null,1));
await browser.close();

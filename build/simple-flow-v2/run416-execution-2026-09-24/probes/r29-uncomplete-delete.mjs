// r28 missed two steps: a fixed x=402 for the line's three-dot does not hold on every work order, and
// the New Line dialog ignores a value set straight on the input (Vue). Fixes: find the line's own
// three-dot as the LEFTMOST visible more_vert inside that row's vertical band, and TYPE for real.
//   E. Uncomplete a Complete line THAT HOLDS PARTS -> C44565 item 2 (status back to Approved, parts unchanged)
//   A/B. New line (Needs Approval) -> its menu, then delete it -> C44566 item 1
//   F. A Declined line's row buttons (is Approve there?) -> C44566 item 3
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
async function vmenu(page){ return await page.evaluate(()=>{
  const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;});
  if(!m.length) return null; const el=m[m.length-1];
  return [...el.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>({
    t:(i.innerText||'').trim().replace(/\s+/g,' '), disabled:i.classList.contains('disabled')||/q-item--disabled/.test(i.className),
    box:(()=>{const r=i.getBoundingClientRect();return{x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})() })).filter(i=>i.t); }); }
async function lines(page){ return await page.evaluate(()=>{const s=new Set(),o=[];
  for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
    if(!i||s.has(i))continue;s.add(i);const r=tr.getBoundingClientRect();
    o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      top:Math.round(r.top),bottom:Math.round(r.bottom),
      buttons:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)});} return o;}); }
// the LINE's own three-dot = leftmost visible more_vert whose centre sits inside that row
async function openLineMenu(page,id){
  const tr=page.locator(`tr.line-row-${id}`).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(1200);
  const spot=await page.evaluate((lid)=>{ const row=document.querySelector(`tr.line-row-${lid}`); if(!row) return null;
    const rb=row.getBoundingClientRect(); const cands=[];
    document.querySelectorAll('button,.q-btn,i,.q-icon').forEach(b=>{ if(!/more_vert/.test((b.innerText||b.textContent||'').trim())) return;
      const r=b.getBoundingClientRect(); if(!r.width||!r.height) return; const cy=r.y+r.height/2;
      if(cy>=rb.top-2 && cy<=rb.bottom+2) cands.push({x:Math.round(r.x+r.width/2),y:Math.round(cy)}); });
    cands.sort((a,b)=>a.x-b.x); return cands[0]||null; }, id);
  if(!spot) return {menu:null, spot:null};
  await page.mouse.click(spot.x,spot.y).catch(()=>{}); await page.waitForTimeout(1900);
  return { menu: await vmenu(page), spot };
}
async function partRows(page){ return await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>/\b(Received|Picked|In Stock|Awaiting|Ordered|Quoted|Auth To Order)\b/.test(t)).slice(0,10)); }

const { browser, page } = await bootProdLogin('/workorders', { settle:11000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const R={};
const S908='068f9856-9d28-4500-a3dd-dd6d7aafb15a', S810='fe72110c-7ff6-47f8-8f83-e3ea447a5280';

// ---------- E: Uncomplete a Complete line that HOLDS PARTS ----------
await openWo(page,S810); await page.waitForTimeout(7000);
let ls = await lines(page);
const comp = ls.find(l=>l.badges.some(b=>/^Complete$/i.test(b)));
console.log('=== E. line chosen:', comp && comp.badges.join('+'), '| row buttons:', JSON.stringify(comp&&comp.buttons));
R.before = { badges: comp.badges, parts: await partRows(page) };
console.log('   parts on the work order BEFORE:', JSON.stringify(R.before.parts));
let { menu } = await openLineMenu(page, comp.id);
console.log('   menu:', JSON.stringify((menu||[]).map(i=>i.t+(i.disabled?' [disabled]':''))));
const un=(menu||[]).find(i=>/^Uncomplete/i.test(i.t));
R.uncompleteOffered=!!un;
if (un) {
  await page.mouse.click(un.box.x, un.box.y); await page.waitForTimeout(3500);
  R.uncompleteDialog = await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    return d?{text:(d.innerText||'').replace(/\s+/g,' ').slice(0,300),buttons:[...d.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(Boolean)}:null;});
  console.log('   dialog:', JSON.stringify(R.uncompleteDialog));
  if (R.uncompleteDialog) { await page.screenshot({path:`${EV}/p3e-uncomplete-dialog.png`}).catch(()=>{});
    await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
      const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Uncomplete|Yes|Confirm|OK|Continue|Save)$/i.test((x.innerText||'').trim())); if(b)b.click();}); await page.waitForTimeout(6000); }
  await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  ls = await lines(page); const now = ls.find(l=>l.id===comp.id);
  R.after = { badges: now?now.badges:null, buttons: now?now.buttons:null, parts: await partRows(page) };
  console.log('   status AFTER Uncomplete:', JSON.stringify(R.after.badges), '| row buttons:', JSON.stringify(R.after.buttons));
  console.log('   parts AFTER:', JSON.stringify(R.after.parts));
  R.partsUnchanged = JSON.stringify(R.before.parts)===JSON.stringify(R.after.parts);
  console.log('   parts unchanged:', R.partsUnchanged);
  await page.screenshot({path:`${EV}/p3e-after-uncomplete.png`, fullPage:true}).catch(()=>{});
  if (now) { const r2 = await openLineMenu(page, now.id);
    R.menuAfter=(r2.menu||[]).map(i=>i.t+(i.disabled?' [disabled]':''));
    R.uncompleteGone = !(r2.menu||[]).some(i=>/^Uncomplete/i.test(i.t));
    console.log('   menu now:', JSON.stringify(R.menuAfter));
    console.log('   Uncomplete correctly GONE from a non-complete line:', R.uncompleteGone);
    await page.keyboard.press('Escape'); await page.waitForTimeout(700);
    // put it back the way it was
    const cbtn=(now.buttons||[]).find(b=>/^Complete$/i.test(b));
    if (cbtn) { await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`);
      const b=[...row.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim())); if(b)b.click();}, now.id);
      await page.waitForTimeout(4000);
      await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!d)return;
        const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Complete|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim())); if(b)b.click();});
      await page.waitForTimeout(5000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
      const l3=await lines(page); const back=l3.find(l=>l.id===comp.id);
      R.restored = back? back.badges : null; console.log('   restored to:', JSON.stringify(R.restored)); }
  }
}
// ---------- F: the Declined line's ROW buttons ----------
ls = await lines(page);
const dec = ls.find(l=>l.badges.some(b=>/Declin/i.test(b)));
if (dec) { R.declinedRowButtons = dec.buttons; console.log('\n=== F. declined line row buttons:', JSON.stringify(dec.buttons)); }

// ---------- A/B: a brand-new line, its menu, then delete it ----------
await openWo(page,S908); await page.waitForTimeout(7000);
const beforeIds=(await lines(page)).map(l=>l.id);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='New Line'); if(b)b.click();});
await page.waitForTimeout(5000);
const dlgInputs = page.locator('.q-dialog input:visible');
const n = await dlgInputs.count(); console.log('\n=== A. New Line dialog inputs:', n);
if (n) { await dlgInputs.nth(0).click(); await dlgInputs.nth(0).type('ZZAUTOTEST delete me', {delay:45});
  if (n>1) { await dlgInputs.nth(1).click(); await dlgInputs.nth(1).type('ZZAUTOTEST', {delay:45}); }
  await page.waitForTimeout(1200);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Save & Close$/i.test((x.innerText||'').replace(/\s+/g,' ').trim())); if(b)b.click();});
  await page.waitForTimeout(9000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
  const l4=await lines(page); const fresh=l4.find(l=>!beforeIds.includes(l.id));
  R.newLine = fresh? {id:fresh.id,badges:fresh.badges,buttons:fresh.buttons} : null;
  console.log('   new line:', JSON.stringify(R.newLine));
  if (fresh) { const r3=await openLineMenu(page, fresh.id);
    R.newLineMenu=(r3.menu||[]).map(i=>i.t+(i.disabled?' [disabled]':''));
    console.log('   its menu:', JSON.stringify(R.newLineMenu));
    await page.screenshot({path:`${EV}/p3e-newline-menu.png`}).catch(()=>{});
    const d=(r3.menu||[]).find(i=>/^Delete line$/i.test(i.t));
    R.deleteOffered=!!d; R.deleteDisabled=d?d.disabled:null;
    if (d && !d.disabled) { await page.mouse.click(d.box.x,d.box.y); await page.waitForTimeout(3500);
      R.deleteDialog=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
        return q?{text:(q.innerText||'').replace(/\s+/g,' ').slice(0,300),buttons:[...q.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(Boolean)}:null;});
      console.log('   delete dialog:', JSON.stringify(R.deleteDialog));
      await page.screenshot({path:`${EV}/p3e-delete-dialog.png`}).catch(()=>{});
      await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!q)return;
        const b=[...q.querySelectorAll('button,.q-btn')].find(x=>/^(Delete|Yes|Confirm|OK)$/i.test((x.innerText||'').trim())); if(b)b.click();});
      await page.waitForTimeout(7000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
      R.lineDeleted = !(await lines(page)).map(l=>l.id).includes(fresh.id);
      console.log('   line actually deleted:', R.lineDeleted); }
  }
}
fs.writeFileSync(`${EV}/p3e-uncomplete-delete.json`, JSON.stringify(R,null,1));
console.log('\nwritten');
await browser.close();

// Problem 3, decisive pass. The menus are now read correctly (r27). Finish the five checks:
//  A. A brand-new line (Needs Approval) - its menu           -> C44566 item 1
//  B. Delete that line from its menu                          -> C44566 "Delete line", C44578 neighbours
//  C. A Declined line's menu                                  -> C44566 item 3
//  D. The DISABLED Decline on a line holding parts + its reason -> C44567
//  E. Uncomplete a Complete line, then read its status + parts -> C44565 item 2, C44603 item 2
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const LINE_DOT_X = 402;   // the LINE's own three-dot. 515 is the labor sub-row's - see playbook.

async function vmenu(page) { return await page.evaluate(()=>{
  const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;});
  if(!m.length) return null; const el=m[m.length-1];
  return [...el.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>({
    t:(i.innerText||'').trim().replace(/\s+/g,' '),
    disabled:i.classList.contains('disabled')||i.getAttribute('aria-disabled')==='true'||/q-item--disabled/.test(i.className),
    title:i.getAttribute('title')||i.getAttribute('aria-label')||'',
    box:(()=>{const r=i.getBoundingClientRect();return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})() })).filter(i=>i.t); }); }
async function lines(page){ return await page.evaluate(()=>{const s=new Set(),o=[];
  for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
    if(!i||s.has(i))continue;s.add(i);const r=tr.getBoundingClientRect();
    o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),y:Math.round(r.y+r.height/2),
      text:(tr.innerText||'').replace(/\s+/g,' ').slice(0,70)});} return o;}); }
async function openLineMenu(page,l){ const tr=page.locator(`tr.line-row-${l.id}`).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(1100);
  const ls=await lines(page); const cur=ls.find(x=>x.id===l.id)||l;
  await page.mouse.click(LINE_DOT_X+8, cur.y).catch(()=>{}); await page.waitForTimeout(1900);
  return await vmenu(page); }

const { browser, page } = await bootProdLogin('/workorders', { settle: 11000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const R = {};
const S908='068f9856-9d28-4500-a3dd-dd6d7aafb15a', S810='fe72110c-7ff6-47f8-8f83-e3ea447a5280', S786='4560a837-ee20-46e5-a62c-c6a4892fc85d';

// ---------- A: a brand-new line ----------
await openWo(page,S908); await page.waitForTimeout(6500);
const before = (await lines(page)).map(l=>l.id);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='New Line'); if(b) b.click();});
await page.waitForTimeout(4500);
await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!d)return;
  const ins=[...d.querySelectorAll('input')].filter(i=>i.getBoundingClientRect().width);
  if(ins[0]){ins[0].focus();ins[0].value='ZZAUTOTEST delete me';ins[0].dispatchEvent(new Event('input',{bubbles:true}));}
  if(ins[1]){ins[1].focus();ins[1].value='ZZAUTOTEST';ins[1].dispatchEvent(new Event('input',{bubbles:true}));}});
await page.waitForTimeout(1200);
await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!d)return;
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Save & Close$/i.test((x.innerText||'').replace(/\s+/g,' ').trim())); if(b) b.click();});
await page.waitForTimeout(8000);
const after = await lines(page);
const fresh = after.find(l=>!before.includes(l.id));
R.newLine = fresh ? { id:fresh.id, badges:fresh.badges, text:fresh.text } : null;
console.log('\n=== A. new line:', JSON.stringify(R.newLine));
if (fresh) {
  R.newLineMenu = await openLineMenu(page, fresh);
  console.log('   its menu:', JSON.stringify((R.newLineMenu||[]).map(i=>i.t+(i.disabled?' [disabled]':''))));
  await page.screenshot({path:`${EV}/p3d-newline-menu.png`}).catch(()=>{});
  // ---------- B: delete it ----------
  const del = (R.newLineMenu||[]).find(i=>/^Delete line$/i.test(i.t));
  R.deleteOffered = !!del; R.deleteDisabled = del? del.disabled : null;
  if (del && !del.disabled) {
    await page.mouse.click(del.box.x, del.box.y); await page.waitForTimeout(3000);
    R.deleteDialog = await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
      return d? {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,320), buttons:[...d.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(Boolean)} : null;});
    console.log('   delete dialog:', JSON.stringify(R.deleteDialog));
    await page.screenshot({path:`${EV}/p3d-delete-dialog.png`}).catch(()=>{});
    const ok = await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!d)return 'no dialog';
      const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Delete|Yes|Confirm|OK)$/i.test((x.innerText||'').trim())); if(!b)return 'no confirm'; b.click(); return 'confirmed';});
    console.log('   confirm:', ok); await page.waitForTimeout(7000);
    const nowIds=(await lines(page)).map(l=>l.id);
    R.lineDeleted = !nowIds.includes(fresh.id);
    console.log('   line actually gone:', R.lineDeleted);
  }
}
// ---------- C + D: Declined line, and the disabled Decline ----------
await openWo(page,S810); await page.waitForTimeout(6500);
const l810 = await lines(page);
console.log('\n=== C/D. S2-810 lines:', JSON.stringify(l810.map(l=>l.badges.join('+'))));
R.s810 = [];
for (const l of l810) {
  const items = await openLineMenu(page,l);
  const dec = (items||[]).find(i=>/^Decline$/i.test(i.t));
  let reason = null;
  if (dec && dec.disabled) { await page.mouse.move(dec.box.x, dec.box.y); await page.waitForTimeout(2500);
    reason = await page.evaluate(()=>{ const t=[...document.querySelectorAll('.q-tooltip')].filter(x=>x.getBoundingClientRect().width).map(x=>(x.innerText||'').trim());
      return t.length? t.join(' | ') : null; });
    await page.screenshot({path:`${EV}/p3d-decline-disabled-${l.badges.join('_')||'none'}.png`}).catch(()=>{}); }
  R.s810.push({ status:l.badges.join('+'), items:(items||[]).map(i=>({t:i.t,disabled:i.disabled})), declineDisabledReason: reason });
  console.log('  ', l.badges.join('+'), '->', JSON.stringify((items||[]).map(i=>i.t+(i.disabled?' [disabled]':''))), reason?('| reason: '+reason):'');
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
// ---------- E: Uncomplete a Complete line ----------
await openWo(page,S786); await page.waitForTimeout(6500);
const l786 = await lines(page);
const comp = l786.find(l=>l.badges.some(b=>/Complete/i.test(b)));
console.log('\n=== E. S2-786 complete line:', comp? comp.badges.join('+') : 'none');
if (comp) {
  R.beforeUncomplete = { badges: comp.badges, parts: await page.evaluate(()=>[...document.querySelectorAll('tr')].map(t=>(t.innerText||'').replace(/\s+/g,' ')).filter(t=>/Received|Picked|In Stock|Awaiting|Ordered|Quoted/.test(t)).slice(0,8)) };
  const items = await openLineMenu(page, comp);
  const un = (items||[]).find(i=>/^Uncomplete/i.test(i.t));
  R.uncompleteOffered = !!un;
  console.log('   Uncomplete offered:', !!un);
  if (un) {
    await page.mouse.click(un.box.x, un.box.y); await page.waitForTimeout(3500);
    R.uncompleteDialog = await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
      return d? {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,300), buttons:[...d.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(Boolean)}:null;});
    console.log('   dialog:', JSON.stringify(R.uncompleteDialog));
    if (R.uncompleteDialog) { await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
      const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Uncomplete|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim())); if(b) b.click();}); await page.waitForTimeout(7000); }
    await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
    const l2 = await lines(page); const now = l2.find(l=>l.id===comp.id);
    R.afterUncomplete = { badges: now? now.badges : null,
      parts: await page.evaluate(()=>[...document.querySelectorAll('tr')].map(t=>(t.innerText||'').replace(/\s+/g,' ')).filter(t=>/Received|Picked|In Stock|Awaiting|Ordered|Quoted/.test(t)).slice(0,8)) };
    console.log('   status after Uncomplete:', JSON.stringify(R.afterUncomplete.badges));
    console.log('   parts before:', JSON.stringify(R.beforeUncomplete.parts));
    console.log('   parts after :', JSON.stringify(R.afterUncomplete.parts));
    await page.screenshot({path:`${EV}/p3d-after-uncomplete.png`, fullPage:true}).catch(()=>{});
    // and is Uncomplete now gone (C44603 item 2)?
    if (now) { const it2 = await openLineMenu(page, now);
      R.uncompleteStillThere = (it2||[]).some(i=>/^Uncomplete/i.test(i.t));
      R.menuAfterUncomplete = (it2||[]).map(i=>i.t+(i.disabled?' [disabled]':''));
      console.log('   menu now:', JSON.stringify(R.menuAfterUncomplete));
      console.log('   Uncomplete still offered on the now-uncompleted line:', R.uncompleteStillThere); }
  }
}
fs.writeFileSync(`${EV}/p3d-problem3-final.json`, JSON.stringify(R,null,1));
console.log('\nwritten');
await browser.close();

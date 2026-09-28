// C44570 - declining a line (or sending it back for authorisation) returns only the parts that have
// NOT yet arrived to Quoted. Parts already received or picked should keep their state.
// The line now carries: one part still awaiting delivery, several received, several picked from stock
// with their cores - which is exactly the mix this needs.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const snap=async()=>await page.evaluate(()=>({
  lines:[...document.querySelectorAll('tr[class*="line-row-"]')].map(r=>({
    id:(r.className.match(/line-row-([0-9a-f-]+)/)||[])[1],
    status:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()).join('+'),
    text:(r.innerText||'').replace(/\s+/g,' ').trim().slice(0,55)})),
  parts:[...document.querySelectorAll('tr')].filter(t=>/drag_indicator|Core/i.test(t.innerText||''))
    .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,105))}));
await openWo(page,WO); await page.waitForTimeout(9000);
R.before=await snap();
console.log('lines before:'); R.before.lines.forEach(l=>console.log('   ',l.status||'(none)','|',l.text));
console.log('parts before:'); R.before.parts.forEach(p=>console.log('   ',p));
// find a line that can be declined - its own three-dot holds Decline
let declined=null;
for(const l of R.before.lines){
  if(!l.id) continue;
  const tr=page.locator('tr.line-row-'+l.id).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(1100);
  const spot=await page.evaluate((lid)=>{const row=document.querySelector('tr.line-row-'+lid); if(!row)return null;
    const rb=row.getBoundingClientRect(); const c=[];
    document.querySelectorAll('button,.q-btn,i,.q-icon').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
      const r=b.getBoundingClientRect(); if(!r.width)return; const cy=r.y+r.height/2;
      if(cy>=rb.top-2&&cy<=rb.bottom+2) c.push({x:Math.round(r.x+r.width/2),y:Math.round(cy)});});
    c.sort((a,b)=>a.x-b.x); return c[0]||null;},l.id);
  if(!spot) continue;
  await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(1900);
  const items=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>{const q=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(q.x+30),y:Math.round(q.y+q.height/2)};}):[];});
  console.log('\nline',l.status,'menu:',JSON.stringify(items.map(i=>i.t+(i.dis?' [disabled]':''))));
  const dec=items.find(i=>/^Decline$/i.test(i.t)&&!i.dis);
  if(dec){ console.log('   declining this one'); await page.mouse.click(dec.x,dec.y); declined=l; await page.waitForTimeout(4000);
    const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      if(!q)return null; const t=(q.innerText||'').replace(/\s+/g,' ').slice(0,240);
      const b=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
        .find(e=>/^(Decline|Yes|Confirm|OK)$/i.test((e.innerText||'').trim())); if(b)b.click(); return t;});
    if(d) console.log('   it asked:',JSON.stringify(d));
    else console.log('   it declined with no confirmation');
    R.declineAsked=!!d;
    await page.waitForTimeout(6000); break; }
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
if(!declined){ console.log('\nno line offers Decline'); fs.writeFileSync(`${EV}/r77-decline.json`,JSON.stringify(R,null,1)); await browser.close(); process.exit(0); }
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.after=await snap();
console.log('\nlines after:'); R.after.lines.forEach(l=>console.log('   ',l.status||'(none)','|',l.text));
console.log('parts after:'); R.after.parts.forEach(p=>console.log('   ',p));
const state=s=>{const m=s.match(/\b(Quoted|Awaiting|In Stock|Auth To Order|Received|Receive Later)\b/); return m?m[1]:'(none)';};
R.moved=[];
for(const b of R.before.parts){ const key=b.slice(0,42);
  const a=R.after.parts.find(x=>x.slice(0,42)===key);
  if(a && state(a)!==state(b)) R.moved.push({part:key.slice(0,40),from:state(b),to:state(a)}); }
console.log('\nparts whose state changed:');
if(!R.moved.length) console.log('   none');
R.moved.forEach(m=>console.log('   ',m.part,':',m.from,'->',m.to));
await page.screenshot({path:`${EV}/r77-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r77-decline.json`,JSON.stringify(R,null,1));
await browser.close();

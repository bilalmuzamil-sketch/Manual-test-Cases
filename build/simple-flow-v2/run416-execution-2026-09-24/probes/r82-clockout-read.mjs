// The clock-out window's text contains "Line Completed?" - which the requirement says should be
// HIDDEN, replaced by two buttons. But my reader found no buttons and no tick boxes, which means it
// is reading the wrong thing, not that the window is empty. Dump EVERY element in that window with
// its tag, class and text, and give it time to finish rendering.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
await openWo(page,WO); await page.waitForTimeout(9000);
// start then stop
let s=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Start$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return 'no Start'; b.click(); return 'pressed Start';});
if(s==='no Start'){ // maybe already running
  s=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].some(e=>/^Stop$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width)?'already running':'neither Start nor Stop'); }
console.log(s); await page.waitForTimeout(6000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Stop$/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width); if(b)b.click();});
await page.waitForTimeout(9000);
R.dump=await page.evaluate(()=>{
  const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>100;}).pop();
  if(!d) return null;
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const out=[];
  d.querySelectorAll('*').forEach(e=>{ if(!vis(e))return;
    const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim();
    const t=own||(e.children.length===0?(e.textContent||'').trim():'');
    const cls=(e.className||'').toString();
    const interesting=/q-btn|q-toggle|q-checkbox|q-radio|button/i.test(cls)||e.tagName==='BUTTON'||e.tagName==='INPUT';
    if(t || interesting){ const r=e.getBoundingClientRect();
      out.push({tag:e.tagName, cls:cls.slice(0,44), t:(t||'').replace(/\s+/g,' ').slice(0,44),
        x:Math.round(r.x), y:Math.round(r.y), interesting}); } });
  return {text:(d.innerText||'').replace(/\s+/g,' ').trim(), elements:out};});
if(!R.dump){ console.log('the window did not open this time'); fs.writeFileSync(`${EV}/r82-clockout.json`,JSON.stringify(R,null,1)); await browser.close(); process.exit(0); }
console.log('\nthe window says:');
console.log('  ',JSON.stringify(R.dump.text.slice(0,420)));
console.log('\nevery control and label in it:');
const seen=new Set();
for(const e of R.dump.elements){ const k=e.tag+e.t+e.x+e.y; if(seen.has(k))continue; seen.add(k);
  if(e.interesting||e.t) console.log('   ',e.tag.padEnd(7),e.cls.padEnd(34),JSON.stringify(e.t)); }
R.controls=R.dump.elements.filter(e=>e.interesting).map(e=>e.cls+' | '+e.t);
R.mentionsLineCompleted=/Line Completed/i.test(R.dump.text);
R.completeButtons=R.dump.elements.filter(e=>/complete/i.test(e.t)&&e.interesting).map(e=>e.t);
console.log('\n>>> the window mentions "Line Completed":',R.mentionsLineCompleted);
console.log('>>> controls whose text mentions complete:',JSON.stringify(R.completeButtons));
await page.screenshot({path:`${EV}/r82-clockout.png`}).catch(()=>{});
fs.writeFileSync(`${EV}/r82-clockout.json`,JSON.stringify(R,null,1));
await browser.close();

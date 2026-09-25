// The annotated picture had its outlines over empty space because I worked the coordinates out by
// hand from remembered page positions. Don't. Capture the screenshot and ASK THE BROWSER for the
// exact box of every element I intend to mark, in the same run, and write both out together.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const CLIP={x:290,y:50,width:1390,height:220};   // recorded WITH the boxes so the mapping is never guessed again
const {browser,page}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(8000);
const boxes=async()=>await page.evaluate(()=>{
  const bb=e=>{if(!e)return null;const r=e.getBoundingClientRect();
    if(!r.width||!r.height)return null;return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
  const vis=e=>{if(!e)return false;const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;
    const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0';};
  const out={};
  // the tab strip: the smallest visible element that holds ALL the tab words
  const strip=[...document.querySelectorAll('div,nav,ul')].filter(e=>{const t=(e.innerText||'');
      return /Lines/.test(t)&&/Notes/.test(t)&&/Stats/.test(t)&&/Finance/.test(t)&&t.length<160&&vis(e);})
    .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)[0];
  out.tabStrip=bb(strip);
  // each tab word, so the strip can be boxed tightly even if the container is padded
  out.tabWords={};
  for(const w of ['Lines','Parts','Notes','Stats','Finance']){
    const el=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&new RegExp('^'+w+'( \\(\\d+\\))?$').test((e.textContent||'').trim())&&vis(e))[0];
    out.tabWords[w]=bb(el);
  }
  const hdr=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
  out.headerRow=bb(hdr);
  out.firstLineRow=bb(document.querySelector('tr[class*="line-row-"]'));
  const bar=document.querySelector('.bulk-action-bar');
  out.bar=bb(bar);
  if(bar){
    const count=bar.querySelector('[class*="count"]');
    out.count=bb(count);
    const btns=[...bar.querySelectorAll('button,.q-btn')].filter(vis)
      .map(b=>({t:(b.innerText||'').replace(/\s+/g,' ').trim(),box:bb(b)})).filter(b=>b.t);
    out.barButtons=btns;
    out.firstAction=btns.find(b=>!/^More/.test(b.t)&&!/close/.test(b.t))||null;
    out.dividers=[...bar.querySelectorAll('[class*="divider"]')].filter(vis).map(bb);
  }
  return out;});

const shot=async(name)=>{await page.screenshot({path:`${EV}/${name}.png`,clip:CLIP});};
const A={clip:CLIP,scale:2};
A.unticked=await boxes(); await shot('p4g-unticked');
console.log('UNTICKED');
console.log('  tab strip  :',JSON.stringify(A.unticked.tabStrip));
console.log('  tab words  :',JSON.stringify(A.unticked.tabWords));
console.log('  header row :',JSON.stringify(A.unticked.headerRow));
console.log('  first line :',JSON.stringify(A.unticked.firstLineRow));

const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
for(const id of ids.slice(0,2)){const tr=page.locator(`tr.line-row-${id}`).first();
  await tr.hover().catch(()=>{});await page.waitForTimeout(800);
  const cb=page.locator(`[data-test-id="line_checkbox_${id}"]`);
  if(await cb.count()){await cb.first().click({timeout:9000}).catch(()=>{});await page.waitForTimeout(1500);} }
await page.mouse.move(20,760); await page.waitForTimeout(2200);
A.ticked=await boxes(); await shot('p4g-ticked');
console.log('\nTICKED');
console.log('  bar        :',JSON.stringify(A.ticked.bar));
console.log('  count      :',JSON.stringify(A.ticked.count));
console.log('  bar buttons:',JSON.stringify((A.ticked.barButtons||[]).map(b=>b.t+' @'+b.box.x)));
console.log('  first action:',JSON.stringify(A.ticked.firstAction));
console.log('  header row :',JSON.stringify(A.ticked.headerRow));
console.log('  first line :',JSON.stringify(A.ticked.firstLineRow));
console.log('  tab words  :',JSON.stringify(A.ticked.tabWords));
fs.writeFileSync(`${EV}/p4g-boxes.json`,JSON.stringify(A,null,1));
await browser.close();

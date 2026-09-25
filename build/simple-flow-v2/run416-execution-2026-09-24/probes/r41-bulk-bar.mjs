// Problem 4 re-check. My claims were: the bar is added ABOVE the column headings rather than replacing
// them; there is no Deselect all; there are no dividers. Every one of those is a NEGATIVE, and the last
// three times I made negatives on this screen they were my own instrument (Rule 104).
// So this time:
//   * enumerate EVERY element in the bar that owns text - not just button/.q-btn. A "Deselect all"
//     rendered as a link, an icon or a plain span is invisible to a button-only scan.
//   * decide "replaces the headers" by whether the header row is STILL PAINTED, measured, not by how
//     the screenshot looks to me.
//   * look for dividers as real elements (.q-separator, hr) AND as CSS borders between groups.
//   * prove nothing shifted, by measuring a fixed element's position before and after selecting.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(8000);

// the header row, and a fixed reference below it, BEFORE anything is selected
const before=await page.evaluate(()=>{
  const hdr=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
  const firstLine=document.querySelector('tr[class*="line-row-"]');
  const bb=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
  return { headerText:hdr?(hdr.innerText||'').replace(/\s+/g,' ').trim():null, header:bb(hdr), firstLine:bb(firstLine) };});
R.before=before;
console.log('BEFORE selecting:');
console.log('  header row :',JSON.stringify(before.header),'|',JSON.stringify(before.headerText));
console.log('  first line :',JSON.stringify(before.firstLine));
await page.screenshot({path:`${EV}/p4a-before.png`}).catch(()=>{});

// select two lines
const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')]
  .map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
for(const id of ids.slice(0,2)){
  const tr=page.locator(`tr.line-row-${id}`).first();
  await tr.hover().catch(()=>{}); await page.waitForTimeout(900);
  const cb=page.locator(`[data-test-id="line_checkbox_${id}"]`);
  if(await cb.count()){ await cb.first().click({timeout:9000}).catch(()=>{}); await page.waitForTimeout(1800); }
}
await page.waitForTimeout(2500);

const after=await page.evaluate(()=>{
  const bb=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
  const vis=e=>{ if(!e) return false; const r=e.getBoundingClientRect(); if(!r.width||!r.height) return false;
    const s=getComputedStyle(e); return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0'; };
  // the header row - is it still painted?
  const hdr=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
  // the bar: the SMALLEST element containing "selected" that also holds a control
  const cands=[...document.querySelectorAll('div,tr,td,header,section')]
    .filter(e=>/\bselected\b/i.test(e.innerText||'') && (e.innerText||'').length<400 && e.querySelector('button,.q-btn,i'));
  cands.sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length);
  const bar=cands[0]||null;
  let items=[], seps=[], borders=[];
  if(bar){
    // EVERY leaf element in the bar that owns text, in document order, with position
    const walk=e=>{ for(const c of e.children){ 
      const t=(c.childNodes.length && [...c.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim())||'';
      const own = t || (c.children.length===0 ? (c.textContent||'').trim() : '');
      const r=c.getBoundingClientRect();
      if(own && r.width && r.height) items.push({t:own.replace(/\s+/g,' ').slice(0,40), x:Math.round(r.x), tag:c.tagName, cls:(c.className||'').toString().slice(0,50)});
      walk(c); } };
    walk(bar);
    seps=[...bar.querySelectorAll('.q-separator,hr,[class*="separator"],[class*="divider"]')]
      .filter(e=>{const r=e.getBoundingClientRect();return r.width||r.height;})
      .map(e=>({cls:(e.className||'').toString().slice(0,60), x:Math.round(e.getBoundingClientRect().x)}));
    // a divider drawn as a CSS border rather than an element
    borders=[...bar.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);
      return (parseFloat(s.borderLeftWidth)>0||parseFloat(s.borderRightWidth)>0) && s.borderLeftStyle!=='none';})
      .slice(0,10).map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').slice(0,30), x:Math.round(e.getBoundingClientRect().x)}));
  }
  const firstLine=document.querySelector('tr[class*="line-row-"]');
  return { headerStillPainted:vis(hdr), header:bb(hdr),
    barText:bar?(bar.innerText||'').replace(/\s+/g,' ').trim():null, bar:bb(bar),
    barTag:bar?bar.tagName+'.'+(bar.className||'').toString().slice(0,50):null,
    items, seps, borders, firstLine:bb(firstLine),
    deselectAnywhereOnPage:/Deselect/i.test(document.body.innerText) };});
R.after=after;
console.log('\nAFTER selecting two lines:');
console.log('  bar          :',JSON.stringify(after.bar),'|',after.barTag);
console.log('  bar reads    :',JSON.stringify(after.barText));
console.log('  header row still painted:',after.headerStillPainted,'| its box now:',JSON.stringify(after.header));
console.log('  first line moved?  before',JSON.stringify(before.firstLine),'-> after',JSON.stringify(after.firstLine));
console.log('  "Deselect" anywhere on the page:',after.deselectAnywhereOnPage);
console.log('\n  EVERY text-owning element inside the bar, left to right:');
for(const i of after.items.sort((a,b)=>a.x-b.x)) console.log('     x='+String(i.x).padStart(5),i.tag.padEnd(6),JSON.stringify(i.t));
console.log('\n  divider ELEMENTS:',JSON.stringify(after.seps));
console.log('  divider-like BORDERS:',JSON.stringify(after.borders));
await page.screenshot({path:`${EV}/p4a-bar-selected.png`}).catch(()=>{});

// open More and read it
const more=await page.evaluate(()=>{const c=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/i.test(e.innerText||'')&&(e.innerText||'').length<400&&e.querySelector('button,.q-btn')).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
  if(!c)return 'no bar'; const b=[...c.querySelectorAll('button,.q-btn')].find(x=>/^More/.test((x.innerText||'').trim())); if(!b)return 'no More'; b.click(); return 'opened';});
if(more==='opened'){ await page.waitForTimeout(2200);
  R.more=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>(i.innerText||'').trim()):null;});
  console.log('\n  More holds:',JSON.stringify(R.more));
  await page.screenshot({path:`${EV}/p4a-more.png`}).catch(()=>{});
  await page.keyboard.press('Escape'); await page.waitForTimeout(900); }
fs.writeFileSync(`${EV}/p4a-bulk-bar.json`,JSON.stringify(R,null,1));
await browser.close();

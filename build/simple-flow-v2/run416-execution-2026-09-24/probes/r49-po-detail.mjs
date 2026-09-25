// Two gaps from the last run, both of the kind that have bitten me all session:
//  C44590 - clicking a row took the row count from 32 to 3 and I did not record the URL. "Nothing
//           expands" is not proven if the click NAVIGATED (Rule 104 names navigation explicitly).
//  C53488 - there IS a "n selected" on the page but no element with the shared bulk-action-bar class.
//           That is itself the answer the case is asking for, but I must FIND and READ the bar the
//           page does raise before describing it, instead of reporting the absence of my selector.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/parts/orders',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
await page.waitForTimeout(7000);
R.startUrl=page.url();

// ---- C44590: click a row and find out WHERE it went ----
const before=await page.evaluate(()=>({url:location.href,rows:document.querySelectorAll('tbody tr').length}));
const cell=await page.evaluate(()=>{const r=[...document.querySelectorAll('tbody tr')].filter(t=>t.getBoundingClientRect().height)[0];
  const tds=[...r.querySelectorAll('td')]; const t=tds[1]||tds[0]; const b=t.getBoundingClientRect();
  return {x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2)};});
await page.mouse.click(cell.x,cell.y); await page.waitForTimeout(5000);
R.afterRowClick=await page.evaluate(()=>({url:location.href,rows:document.querySelectorAll('tbody tr').length,
  heading:(document.querySelector('h1,h2,.text-h5,.text-h6')||{}).innerText||null,
  bodyStart:document.body.innerText.replace(/\s+/g,' ').slice(0,180)}));
console.log('=== C44590 ===');
console.log('  before the click:',JSON.stringify(before));
console.log('  after  the click:',JSON.stringify(R.afterRowClick));
R.navigated = before.url !== R.afterRowClick.url;
console.log('  did the click NAVIGATE away?',R.navigated);
await page.screenshot({path:`${EV}/p5b-after-rowclick.png`}).catch(()=>{});

// ---- C53488: find the bar the PO page actually raises ----
await page.goto(`${APP}/parts/orders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
const n=await page.evaluate(()=>{const b=[...document.querySelectorAll('tbody tr')]
    .map(r=>r.querySelector('.q-checkbox,[type=checkbox],[data-test-id*="checkbox"]')).filter(Boolean);
  b.slice(0,2).forEach(x=>x.click()); return b.length;});
await page.waitForTimeout(3500);
console.log('\n=== C53488 ===');
console.log('  tick boxes on the page:',n);
R.selection=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>10&&r.height>10;};
  // the smallest VISIBLE element that says "n selected" and holds a control - the page's own bar,
  // whatever class it happens to use
  const cands=[...document.querySelectorAll('div,section,header,footer,tr')]
    .filter(e=>/\d+\s+selected/i.test(e.innerText||'')&&(e.innerText||'').length<400&&e.querySelector('button,.q-btn,i')&&vis(e))
    .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length);
  const bar=cands[0]; if(!bar) return {found:false};
  const walk=(e,out)=>{for(const c of e.children){const own=[...c.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent.trim()).join(' ').trim();
      const t=own||(c.children.length===0?(c.textContent||'').trim():''); const r=c.getBoundingClientRect();
      if(t&&r.width&&r.height) out.push({t:t.replace(/\s+/g,' ').slice(0,40),x:Math.round(r.x)});
      walk(c,out);} return out;};
  const b=bar.getBoundingClientRect();
  return {found:true, cls:(bar.className||'').toString().slice(0,80), tag:bar.tagName,
    box:{x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)},
    text:(bar.innerText||'').replace(/\s+/g,' ').trim(),
    buttons:[...bar.querySelectorAll('button,.q-btn')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    dividers:[...bar.querySelectorAll('[class*="divider"],[class*="separator"]')].filter(vis).length,
    items:walk(bar,[]).sort((a,b)=>a.x-b.x),
    deselectAnywhere:/Deselect/i.test(document.body.innerText),
    receiveSelected:/Receive selected/i.test(document.body.innerText),
    assignVendor:/Assign vendor/i.test(document.body.innerText),
    sharedClassPresent: !!document.querySelector('[class*="bulk-action-bar"]')};});
console.log('  bar found:',R.selection.found);
if(R.selection.found){
  console.log('  it is a',R.selection.tag,'with class:',JSON.stringify(R.selection.cls));
  console.log('  the work order bar\'s own class present anywhere:',R.selection.sharedClassPresent);
  console.log('  bar reads:',JSON.stringify(R.selection.text));
  console.log('  buttons  :',JSON.stringify(R.selection.buttons));
  console.log('  dividers :',R.selection.dividers);
  console.log('  "Deselect" on the page:',R.selection.deselectAnywhere,
              '| "Receive selected":',R.selection.receiveSelected,'| "Assign vendor":',R.selection.assignVendor);
  console.log('  every text element in it:');
  for(const i of R.selection.items) console.log('     x='+String(i.x).padStart(5),JSON.stringify(i.t));
}
await page.screenshot({path:`${EV}/p5b-po-bar.png`}).catch(()=>{});
fs.writeFileSync(`${EV}/p5b-po-detail.json`,JSON.stringify(R,null,1));
await browser.close();

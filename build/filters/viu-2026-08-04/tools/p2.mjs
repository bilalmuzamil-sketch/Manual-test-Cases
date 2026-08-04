import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page,netlog}=await boot();
const R={};
await page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(12000);
const chip=n=>page.locator(`button.filter-chip:has-text("${n}")`).first();
async function menu(){
  return await page.evaluate(()=>{
    const m=[...document.querySelectorAll('.q-menu,.q-popup-proxy,.q-dialog')].filter(e=>e.offsetParent!==null);
    if(!m.length) return null;
    const e=m[m.length-1];
    return {text:e.innerText, cls:e.className,
      items:[...e.querySelectorAll('.q-item')].map(i=>({t:i.innerText.trim().replace(/\n/g,'|'),
        cb:!!i.querySelector('input[type=checkbox],.q-checkbox'),
        checked:(()=>{const c=i.querySelector('.q-checkbox');return c?(c.getAttribute('aria-checked')||c.className.includes('truthy')):null;})(),
        check:!!i.querySelector('.q-icon')&&[...i.querySelectorAll('.q-icon')].map(x=>x.textContent.trim()).join(',')})),
      inputs:[...e.querySelectorAll('input')].map(i=>({ph:i.placeholder,type:i.type,val:i.value})),
      buttons:[...e.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean)};
  });
}
const listCalls=()=>netlog.filter(n=>n.phase==='res'&&n.url.includes('/api/work-orders?')).map(n=>decodeURIComponent(n.url.split('?')[1]));
function rowInfo(){return page.evaluate(()=>{
  const tr=[...document.querySelectorAll('tbody tr')];
  return {n:tr.length, statuses:[...new Set(tr.map(r=>{const c=r.querySelectorAll('td');return c[1]?c[1].innerText.trim():'';}))],
    customers:[...new Set(tr.map(r=>{const c=r.querySelectorAll('td');return c[3]?c[3].innerText.trim():'';}))].slice(0,12)};});}
// --- STATUS chip ---
R.before=await rowInfo();
await chip('Status').click(); await page.waitForTimeout(1800);
R.statusMenu=await menu();
await page.screenshot({path:'/tmp/fviu/shots/02-status-dropdown.png'});
// tick Estimate
const n0=listCalls().length;
await page.locator('.q-menu .q-item:has-text("Estimate")').first().click();
await page.waitForTimeout(4000);
R.afterTickCalls=listCalls().slice(n0);
R.statusMenuAfterTick=await menu();
R.afterTick=await rowInfo();
R.chipTextAfter=await page.evaluate(()=>[...document.querySelectorAll('button.filter-chip')].map(b=>({t:b.innerText.trim().replace(/\n/g,'|'),cls:b.className.includes('active')?'HAS-active':'',style:getComputedStyle(b).backgroundColor,color:getComputedStyle(b).color,disabled:b.disabled})));
await page.screenshot({path:'/tmp/fviu/shots/03-status-estimate-ticked.png'});
R.urlAfterTick=page.url();
// tick a second status
const n1=listCalls().length;
await page.locator('.q-menu .q-item:has-text("Approved")').first().click();
await page.waitForTimeout(4000);
R.secondTickCalls=listCalls().slice(n1);
R.afterTwo=await rowInfo();
R.urlAfterTwo=page.url();
R.chipTextAfterTwo=await page.evaluate(()=>[...document.querySelectorAll('button.filter-chip')].map(b=>b.innerText.trim().replace(/\n/g,'|')));
await page.screenshot({path:'/tmp/fviu/shots/04-status-two-ticked.png'});
// clear-filters presence
R.clearFilters=await page.evaluate(()=>[...document.querySelectorAll('button,a,span,div')].filter(e=>/clear filters/i.test(e.innerText||'')&&e.getBoundingClientRect().height>8&&e.getBoundingClientRect().height<60).map(e=>({t:e.innerText.trim(),tag:e.tagName,cls:e.className.slice(0,60)})).slice(0,4));
// Clear selection
const n2=listCalls().length;
const cs=page.locator('.q-menu').last().locator('text=Clear selection').first();
R.clearSelectionExists=await cs.count();
if(await cs.count()){ await cs.click(); await page.waitForTimeout(3500); }
R.afterClearSel=await rowInfo();
R.clearSelCalls=listCalls().slice(n2);
R.menuAfterClear=await menu();
await page.screenshot({path:'/tmp/fviu/shots/05-after-clear-selection.png'});
// click outside closes
await chip('Status').click(); await page.waitForTimeout(1500);
await page.locator('.q-menu .q-item:has-text("Paid")').first().click();
await page.waitForTimeout(3000);
await page.mouse.click(20,700); await page.waitForTimeout(1500);
R.menuAfterOutsideClick=await menu();
R.rowsAfterOutside=await rowInfo();
R.chipAfterOutside=await page.evaluate(()=>[...document.querySelectorAll('button.filter-chip')].map(b=>b.innerText.trim().replace(/\n/g,'|')));
R.urlAfterOutside=page.url();
await page.screenshot({path:'/tmp/fviu/shots/06-outside-click.png'});
fs.writeFileSync('/tmp/fviu/p2.json',JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,7000));
await browser.close();

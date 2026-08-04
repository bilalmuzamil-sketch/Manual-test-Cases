import {boot,APP,api,BASE,COOKIE} from './boot.mjs';
import fs from 'fs';
export {APP,api,BASE,COOKIE};
export async function open(opts={}){
  const b=await boot(opts);
  await b.page.goto(APP+(opts.path||'/workorders'),{waitUntil:'domcontentloaded',timeout:90000});
  await b.page.waitForTimeout(opts.settle||12000);
  return b;
}
export const chipSel=n=>`button.filter-chip:has-text("${n}")`;
export async function chips(page){return page.evaluate(()=>{
  return [...document.querySelectorAll('button.filter-chip')].map(b=>{
   const r=b.getBoundingClientRect();const cs=getComputedStyle(b);
   return {text:b.innerText.trim().replace(/\n/g,'|'),cls:b.className,
    disabled:b.disabled||b.getAttribute('aria-disabled')==='true'||b.className.includes('disabled'),
    bg:cs.backgroundColor,fg:cs.color,x:Math.round(r.x),y:Math.round(r.y),
    w:Math.round(r.width),h:Math.round(r.height),testid:b.getAttribute('data-test-id')};});
});}
export async function panel(page){return page.evaluate(()=>{
  const p=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed');
  if(!p.length) return null; const e=p[p.length-1];
  const r=e.getBoundingClientRect();
  return {cls:e.className,text:e.innerText,y:Math.round(r.y),h:Math.round(r.height),w:Math.round(r.width),
   options:[...e.querySelectorAll('[role=checkbox],.filter-option-list-panel__option,[role=listitem],.filter-search-list-panel__options > *')].map(o=>({label:o.getAttribute('aria-label')||o.innerText.trim(),checked:o.getAttribute('aria-checked'),testid:o.getAttribute('data-test-id'),cls:o.className.toString().slice(0,90),icons:[...o.querySelectorAll('i,.q-icon')].map(i=>i.textContent.trim()).filter(Boolean)})),
   tags:[...e.querySelectorAll('.q-chip')].map(c=>({t:c.innerText.trim(),removable:!!c.querySelector('.q-chip__icon--remove'),cls:c.className.slice(0,70)})),
   inputs:[...e.querySelectorAll('input:not([type=checkbox])')].map(i=>({ph:i.placeholder,val:i.value,testid:i.getAttribute('data-test-id')})),
   buttons:[...e.querySelectorAll('button,.filter-option-list-panel__clear,[class*=clear]')].map(b=>({t:b.innerText.trim(),cls:b.className.slice(0,70),testid:b.getAttribute('data-test-id')})).filter(b=>b.t),
   footerText:(()=>{const f=e.querySelector('[class*=footer],[class*=clear]');return f?f.innerText.trim():null;})(),
   allTestIds:[...e.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')).slice(0,40)};});}
export async function rows(page){return page.evaluate(()=>{
  const tr=[...document.querySelectorAll('tbody tr')].filter(r=>r.querySelectorAll('td').length>3);
  const cell=(r,i)=>{const c=r.querySelectorAll('td');return c[i]?c[i].innerText.trim().replace(/\n/g,' '):'';};
  return {n:tr.length,
   statuses:[...new Set(tr.map(r=>cell(r,1)))],
   numbers:tr.map(r=>cell(r,2)).slice(0,40),
   customers:[...new Set(tr.map(r=>cell(r,3)))],
   advisors:[...new Set(tr.map(r=>cell(r,8)))],
   techs:[...new Set(tr.map(r=>cell(r,9)))],
   onsite:tr.map(r=>{const c=r.querySelectorAll('td')[0];const i=c?c.querySelector('i,.q-icon'):null;return i?getComputedStyle(i).color:'';}).slice(0,30),
   emptyText:(()=>{const t=document.querySelector('tbody');return t&&tr.length===0?t.innerText.trim().slice(0,300):null;})()};});}
export function listCalls(netlog){return netlog.filter(n=>n.phase==='res'&&/\/api\/work-orders\?/.test(n.url)).map(n=>({status:n.status,q:decodeURIComponent(n.url.split('?')[1])}));}
export function prefCalls(netlog){return netlog.filter(n=>n.phase==='res'&&/preferences/.test(n.url)).map(n=>({status:n.status,method:n.method,url:n.url.replace(/^https:\/\/[^/]+/,'')}));}
export async function tick(page,testid,chipName){
  let loc=page.locator(`[data-test-id="${testid}"]`).first();
  if(await loc.count()===0 && chipName){
    await page.locator(chipSel(chipName)).first().click(); await page.waitForTimeout(1800);
    loc=page.locator(`[data-test-id="${testid}"]`).first();
  }
  if(await loc.count()===0) return {clicked:false,reason:'option not present'};
  await loc.click({timeout:15000}); await page.waitForTimeout(3500); return {clicked:true};}
export async function clearSel(page){
  const el=page.locator('.q-menu').last().locator('text=/Clear Selection/i').first();
  if(await el.count()){await el.click();await page.waitForTimeout(3500);return true;} return false;}
export async function shot(page,name){await page.screenshot({path:'/tmp/fviu/shots/'+name+'.png'});}
export function save(name,obj){fs.writeFileSync('/tmp/fviu/'+name+'.json',JSON.stringify(obj,null,1));}

export async function panelOpen(page){const p=await panel(page);return !!p;}
export async function openChip(page,name,tries=3){
  for(let i=0;i<tries;i++){
    const loc=page.locator(chipSel(name)).first();
    if(await loc.count()===0) return {ok:false,reason:'chip absent'};
    await loc.click({timeout:20000}); await page.waitForTimeout(1800);
    if(await panelOpen(page)) return {ok:true,attempt:i+1};
  }
  return {ok:false,reason:'panel did not open'};
}
export async function closePanel(page){
  await page.keyboard.press('Escape'); await page.waitForTimeout(900);
  if(await panelOpen(page)){ await page.mouse.click(700,44); await page.waitForTimeout(900); }
}
export async function resetFilters(page){
  await closePanel(page);
  const cf=page.locator('[data-test-id="clear_filters"]');
  if(await cf.count()){ await cf.first().click({timeout:15000}); await page.waitForTimeout(4000); return true; }
  return false;
}
export async function clearSelById(page,field){
  const el=page.locator(`[data-test-id="filter_clear_selection_${field}"]`).first();
  if(await el.count()===0) return {ok:false,reason:'clear-selection control absent'};
  await el.click({timeout:15000}); await page.waitForTimeout(3500); return {ok:true};
}

export async function chipEnabled(page,name){
  return page.evaluate(n=>{const b=[...document.querySelectorAll('button.filter-chip')].find(x=>x.innerText.trim().startsWith(n));
    if(!b) return {found:false};
    return {found:true,disabled:b.disabled,aria:b.getAttribute('aria-disabled'),cls:b.className,
      pe:getComputedStyle(b).pointerEvents,opacity:getComputedStyle(b).opacity};},name);
}
export function runner(file){
  const R={};
  const fs=require0();
  return R;
}
function require0(){return null;}

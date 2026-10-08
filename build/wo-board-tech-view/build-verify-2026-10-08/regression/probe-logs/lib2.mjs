import {start,mk,B,OUT} from './woblib.mjs'; import fs from 'fs';
export {start,mk,B,OUT};
export function L(name){const f='/tmp/cln/agent-R/'+name+'.log'; fs.writeFileSync(f,''); return (...a)=>fs.appendFileSync(f,a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' ')+'\n');}
export const btns=(page,sel='body')=>page.evaluate(s=>[...document.querySelector(s)?.querySelectorAll('button,[role=button],a,.q-tab')||[]].filter(e=>e.offsetParent).map(e=>((e.getAttribute('aria-label')||'')+'~'+e.innerText.replace(/\s+/g,' ').trim()).slice(0,70)).filter(x=>x!=='~'),sel);
export const menu=(page)=>page.evaluate(()=>[...document.querySelectorAll('.q-menu,[role=menu],.q-dialog,[role=listbox]')].filter(e=>e.offsetParent||e.getClientRects().length).map(e=>e.innerText.replace(/\s+/g,' ').trim()).join(' || ').slice(0,2500));
export const inputs=(page,sel='body')=>page.evaluate(s=>[...document.querySelector(s).querySelectorAll('input,textarea,select')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||'')+'|'+(e.placeholder||'')+'|'+(e.closest('.q-field')?.innerText||'').replace(/\s+/g,' ').slice(0,50)+'|'+e.value),sel);

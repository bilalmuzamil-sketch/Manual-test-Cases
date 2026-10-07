import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2}); const p=s.page;
await s.go('/parts/returns'); await p.waitForTimeout(3000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tr')].filter(r=>/P550848/.test(r.innerText)).map(r=>{const c=r.querySelector('[data-test-id^="return_request_checkbox_"]'); const b=c?.getBoundingClientRect(); return {t:r.innerText.replace(/\s+/g,' ').slice(0,200),cb:c?.getAttribute('data-test-id'),x:b?b.x+b.width/2:null,y:b?b.y+b.height/2:null};}));
console.log('rows',j(rows,800));
const r=rows[0]; await p.mouse.click(r.x,r.y); await p.waitForTimeout(1500);
const btns=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id],button')].filter(e=>e.getBoundingClientRect().width>0&&/credit|receive|return/i.test((e.innerText||'')+(e.getAttribute('data-test-id')||''))).map(e=>(e.getAttribute('data-test-id')||'')+'|'+(e.innerText||'').trim().slice(0,30)));
console.log('buttons',j(btns,600)); await p.screenshot({path:'raw/A-5-returns-ticked.png'});
await s.close();

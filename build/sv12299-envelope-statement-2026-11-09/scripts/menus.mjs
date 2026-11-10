import {sess,load} from './common.mjs'; const S=load(); const s=await sess(); const p=s.page;
await s.go(`/workorders/${S.wo}/lines`); await p.waitForTimeout(4000); await p.locator('.q-tab, a, [role=tab]',{hasText:/^Finance$/}).first().click(); await p.waitForTimeout(4000);
const btns=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.querySelector('i')?.innerText==='more_vert').map(b=>{const r=b.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,b.getAttribute('data-test-id')];}));
for(const [x,y,id] of btns){ await p.mouse.click(x,y); await p.waitForTimeout(1000); console.log(id,JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>i.innerText.trim()+' ['+(i.getAttribute('data-test-id')||'')+']')))); await p.keyboard.press('Escape'); await p.waitForTimeout(500); }
console.log('icon buttons',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().y<120&&b.getBoundingClientRect().y>60).map(b=>(b.getAttribute('data-test-id')||'')+':'+(b.getAttribute('aria-label')||b.innerText.trim()).slice(0,30)))));
await s.close(); process.exit(0);

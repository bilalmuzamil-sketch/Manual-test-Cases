import {prod} from '../common.mjs'; const [WO,LID]=process.argv.slice(2); const s=await prod('/tmp/qa71'); const p=s.page;
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(5000);
console.log((await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+':'+e.innerText.trim().slice(0,20).replace(/\n/g,' ')).filter(x=>/line/i.test(x)))).join('\n'));
const m=p.locator(`[data-test-id*="line_menu"], [data-test-id*="line_context"], [data-test-id*="menu_line"]`).first(); if(await m.count()){ await m.click(); await p.waitForTimeout(1000); console.log('MENU',(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>(i.getAttribute('data-test-id')||'')+':'+i.innerText.trim()))).join(' | ')); }
await s.close(); process.exit(0);

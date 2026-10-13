import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json'));
const s=await op({dpr:1}); const p=s.page; await setLoc(s);
await s.go('/workorders/'+W.wo+'/lines'); await p.waitForTimeout(4000);
const b=await s.box('button_add_part'); console.log('add part box',J(b)); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3000);
console.log('dialogs',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,400)).join(' ## ')));
console.log('ids',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'<'+e.tagName).join(' ')));
await p.screenshot({path:'u3.png'}); await s.close();

import {op,setLoc} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json')); const s=await op({}); const p=s.page; await setLoc(s);
await s.go('/workorders/'+W.wo+'/lines'); await p.waitForTimeout(5000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="part_number_"]')].map(e=>{let n=e;for(let i=0;i<6&&n;i++){n=n.parentElement;if(n.querySelector('[data-test-id="button_part_request_action"],[data-test-id^="button_edit_part_"]'))break;}return e.getAttribute('data-test-id').slice(12,20)+' | '+(n||e).innerText.replace(/\s+/g,' ').slice(0,140)}));
console.log(rows.join('\n')); console.log('title',await p.title()); await s.close();

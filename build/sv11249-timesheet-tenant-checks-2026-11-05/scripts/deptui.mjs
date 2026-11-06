// usage: node deptui.mjs <name> -> org A: Administration > Departments > New Department (clicked by position), fills the first input, saves; prints the write requests and dialog ids
import {sess} from './common.mjs'; const N=process.argv[2]; const s=await sess(); const p=s.page; await s.go('/administration/departments'); await p.waitForTimeout(9000);
const bb=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,a,div')].find(x=>x.children.length<3&&/^New Department$/.test((x.innerText||'').trim())); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,id:e.getAttribute('data-test-id')};});
console.log('BTN',JSON.stringify(bb)); if(!bb){ await p.screenshot({path:'../ev/dept2.png'}); await s.close(); process.exit(0);} await p.mouse.click(bb.x,bb.y); await p.waitForTimeout(2000);
console.log('DLG',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).join(' ')));
const n=s.writes.length; await p.locator('.q-dialog input').first().fill(N); await p.waitForTimeout(400); await p.locator('.q-dialog [data-test-id="button_confirm_dialog"]').click().catch(e=>console.log('noconfirm')); await p.waitForTimeout(3000); console.log('W',s.writes.slice(n).join('\n'));
await s.close(); process.exit(0);

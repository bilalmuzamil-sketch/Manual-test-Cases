import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/administration/staff'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="button_add_new_staff_member"]').click(); await p.waitForTimeout(2000);
const ids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'<'+e.tagName.toLowerCase()+'>'));
console.log(ids.join(' ')); console.log(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,900)));
await p.screenshot({path:'/tmp/sv12183/add-dialog.png'}); await s.close(); process.exit(0);

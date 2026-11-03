import {prod1} from '../common.mjs'; const s=await prod1('/tmp/qa75'); const p=s.page; const C='bd77eaa6-963f-43fc-9a91-b950810ebf67';
await s.go(`/customers/${C}/contacts`); await p.waitForTimeout(6000);
console.log('ROWS',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(t=>t.innerText.replace(/\s+/g,' ').trim().slice(0,140)).slice(0,8))));
console.log('IDS',(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).filter(x=>/contact|edit/i.test(x)))).slice(0,20).join(' | '));
const e=p.locator('[data-test-id^="button_edit_contact"], [data-test-id*="edit_contact"]').first(); if(await e.count()){ await e.click(); await p.waitForTimeout(1500); console.log('DLG',(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\n+/g,' | ').slice(0,600)))); console.log('DLGIDS',(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')))).join(' ')); await p.screenshot({path:'sv11662/00d-contact-edit.png'}); }
await s.close(); process.exit(0);

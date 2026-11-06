import {sess} from './common.mjs'; const s=await sess(); const p=s.page;
await s.go('/inspection-templates/'+process.env.TPL); await p.waitForTimeout(8000);
const cnt=async()=>(await p.locator('[data-test-id="text_builder_field_count"]').innerText().catch(()=>'(no counter)')).trim();
console.log('start',await cnt(),await p.locator('[data-test-id^="builder_field_field_"]').count());
const add=p.locator('[data-test-id^="builder_add_field_section_"]').last(); await add.scrollIntoViewIfNeeded(); await add.click(); await p.waitForTimeout(1500);
console.log('after add (checkbox)',await cnt());
const nf=p.locator('[data-test-id^="builder_field_label_field_"]').last(); await nf.scrollIntoViewIfNeeded(); await nf.click(); await p.waitForTimeout(1500); await p.click('[data-test-id="inspector_type_instructions"]'); await p.waitForTimeout(1500); const dl=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?d.innerText.replace(/\s+/g,' ').slice(0,200):null}); console.log('dialog',dl); if(dl){ const b=p.locator('.q-dialog button').filter({hasText:/change|ok|confirm|yes/i}).last(); if(await b.count()){ await b.click(); await p.waitForTimeout(1500);} }
const last=p.locator('[data-test-id^="builder_field_meta_field_"]').last(); console.log('new field type',(await last.innerText()).replace(/\s+/g,' '),'counter',await cnt());
await p.locator('[data-test-id="text_builder_field_count"]').scrollIntoViewIfNeeded().catch(()=>{}); await p.screenshot({path:'../ev/branch-instr-450.png'});
await p.click('[data-test-id="builder_save_draft"]'); await p.waitForTimeout(3000); console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')))));
await s.go('/administration/inspection-templates?tab=drafts'); await p.waitForTimeout(6000); console.log('list',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('tr,.q-item,[class*="card"]')].map(e=>e.innerText.replace(/\s+/g,' ')).filter(t=>/SV9570/.test(t)).slice(0,12))));
await p.screenshot({path:'../ev/branch-tpl-list-drafts.png'}); await s.close(); process.exit(0);

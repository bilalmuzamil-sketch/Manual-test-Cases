import {sess} from './common.mjs'; const s=await sess(); const p=s.page;
await s.go('/inspection-templates/'+process.env.TPL); await p.waitForTimeout(8000);
const rows=()=>p.locator('[data-test-id^="builder_field_field_"]').count(); const cnt=async()=>(await p.locator('[data-test-id="text_builder_field_count"]').innerText().catch(()=>'(no counter)')).trim();
console.log('start rows',await rows(),await cnt());
const add=p.locator('[data-test-id^="builder_add_field_section_"]').last(); await add.scrollIntoViewIfNeeded(); await add.click(); await p.waitForTimeout(2000);
console.log('after add rows',await rows(),await cnt()); const pop=await p.evaluate(()=>{const d=document.querySelector('.q-menu,.q-dialog'); return d?{t:d.innerText.replace(/\s+/g,' ').slice(0,300),ids:[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).slice(0,15)}:null}); console.log('popup',JSON.stringify(pop));
if(process.env.OPT){ await p.locator(`[data-test-id^="builder_add_field_option_${process.env.OPT}_section_"]`).first().click(); await p.waitForTimeout(2000);
  console.log('after pick',process.env.OPT,'rows',await rows(),await cnt()); const lc=p.locator('[data-test-id="text_builder_field_count"]'); if(await lc.count()) await lc.scrollIntoViewIfNeeded(); await p.screenshot({path:`../ev/branch-add-${process.env.OPT}.png`});
  if(process.env.SAVE){ await p.click('[data-test-id="builder_save_draft"]'); await p.waitForTimeout(3000); console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' '))))); } }
await p.screenshot({path:'../ev/branch-addfield.png'}); await s.close(); process.exit(0);

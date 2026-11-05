import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,I]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500);
await p.locator('[data-test-id="line_title"]').nth(Number(I)).click({button:'right'}); await p.waitForTimeout(1200); await p.locator('[data-test-id="menu-item_edit_labor"]').click(); await p.waitForTimeout(2500);
await p.locator('[data-test-id="select_technician"]').click(); await p.waitForTimeout(1200); console.log('OPTIONS',(await p.locator('.q-menu .q-item').allInnerTexts()).slice(0,6).map(x=>x.replace(/\s+/g,' ')).join(' | ')); await p.keyboard.press('Escape'); await p.waitForTimeout(600);
const n=s.writes.length; await p.locator('[data-test-id="button_save_labour"]').click(); await p.waitForTimeout(2500);
console.log('DIALOG',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(x=>x.innerText.replace(/\s+/g,' ').slice(0,300))));
const c=p.locator('.q-dialog button').filter({hasText:/^(Yes|Confirm|Are You Sure\?|Remove|Save)$/}); if(await c.count()){ await c.last().click(); await p.waitForTimeout(2500);} 
console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,300)))); await p.screenshot({path:`../ev/${TAG}-editlabor-saved.png`}); await s.close(); process.exit(0);

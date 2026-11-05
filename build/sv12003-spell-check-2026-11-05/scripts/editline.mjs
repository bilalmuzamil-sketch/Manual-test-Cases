import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const S=JSON.parse(fs.readFileSync('/tmp/sv12003/seed-branch-s1.json','utf8'));
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="line_title"]').first().click(); await p.waitForTimeout(2000);
console.log('after title click',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,120))));
await p.keyboard.press('Escape'); await p.waitForTimeout(800);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&/edit|line_/i.test(b.getAttribute('data-test-id'))).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().replace(/\s+/g,' ').slice(0,20))); console.log(ids.slice(0,30));
await s.close(); process.exit(0);

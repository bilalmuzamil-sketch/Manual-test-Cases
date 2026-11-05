// usage: node invtab.mjs <tag> [shot] -> Customer > Invoices tab: rows (text) + header buttons; screenshot
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,SHOT]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11116/seed-${TAG}.json`,'utf8')); const s=await sess({dpr:2}); const p=s.page;
await s.go(`/customers/${S.company}/invoices`); await p.waitForTimeout(5000);
console.log('ROWS',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('table tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,200)))));
console.log('BTNS',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="button"]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.replace(/\s+/g,' ').trim().slice(0,25)).join(' | ')));
await p.screenshot({path:`../ev/${SHOT||TAG+'-invtab'}.png`}); await s.close(); process.exit(0);

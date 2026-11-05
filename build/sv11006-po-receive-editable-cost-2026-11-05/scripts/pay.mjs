// usage: node pay.mjs <tag> -> WO Finance > New Payment > Cash > full balance > Make Payment (screen)
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${ENV}-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(3500); await p.locator('.q-tab, [role=tab]').filter({hasText:/^Finance/}).first().click(); await p.waitForTimeout(4000);
await p.getByText('New Payment',{exact:true}).first().click(); await p.waitForTimeout(2500);
const ids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,30)+'|'+(e.value||'')));
console.log('IDS',ids.join(' ; ')); await p.screenshot({path:`../ev/${ENV}-pay-${process.argv[2]}-1.png`});
if(process.argv[3]==='go'){ const n=s.writes.length;
  await p.locator('[data-test-id="select_payment_method"]').click(); await p.waitForTimeout(1000); const opts=await p.locator('.q-menu .q-item').allInnerTexts(); console.log('methods',opts.map(x=>x.trim())); await p.locator('.q-menu .q-item').nth(opts.findIndex(x=>x.trim()==='Cash')).click(); await p.waitForTimeout(800);
  const mk=p.locator('[data-test-id="button_make_payment"]'); console.log('make enabled',await mk.isEnabled()); await mk.click(); await p.waitForTimeout(3500);
  const c=p.locator('.q-dialog button').filter({hasText:/^(Yes|Confirm|Are You Sure\?)$/}); if(await c.count()){ await c.last().click(); await p.waitForTimeout(3000);} 
  console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,200)))); await p.screenshot({path:`../ev/${ENV}-pay-${process.argv[2]}-2.png`}); 
  console.log('STATUS',await p.locator('[data-test-id="badge_wo_status"]').innerText()); }
await s.close(); process.exit(0);

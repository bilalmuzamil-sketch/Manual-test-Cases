// On screen: part row menu -> Add Part Fee / Discount -> fill -> Add. One session, several adds.
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv11904/'+f,'utf8').trim(); const PS=process.env.PS||'90a95f29-f405-4763-834d-6e3a237f8c33';
const ADDS=JSON.parse(process.argv[2]); // [{row,name,kind,calc,val}]
const s=await open({env:'branch',ticket:'11904',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa41',vp:{width:1440,height:900}}); const p=s.page;
const caps=[]; p.on('response',async r=>{ if(r.request().method()==='POST'&&/adjust/.test(r.url())) caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,''));});
for(const a of ADDS){
  await s.go(`/parts/part-sale/${PS}/part-requests`); await p.waitForTimeout(6000);
  await p.locator('[data-test-id^="button_part_request_menu_"]').nth(a.row).click(); await p.waitForTimeout(1000);
  await p.locator('[data-test-id^="menu_item_add_part_adjustment_"]').first().click(); await p.waitForTimeout(2000);
  const n=p.locator('[data-test-id="input_adjustment_name"] input, input[data-test-id="input_adjustment_name"]').first(); await n.click(); await n.fill(a.name);
  if(a.kind==='discount'){ await p.locator('[data-test-id="select_adjustment_type"]').first().click(); await p.waitForTimeout(900); await p.locator('.q-menu .q-item',{hasText:/Discount/}).first().click(); await p.waitForTimeout(800); }
  if(a.calc==='flat'){ await p.locator('[data-test-id="select_adjustment_calc_type"]').first().click(); await p.waitForTimeout(900);
    const opts=await p.$$eval('.q-menu .q-item',es=>es.map(e=>e.innerText.trim())); console.log('calc options',JSON.stringify(opts));
    await p.locator('.q-menu .q-item',{hasText:/Flat|Fixed|Amount/i}).first().click(); await p.waitForTimeout(900);
    const ids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id^="input_adjustment"]')].map(e=>e.getAttribute('data-test-id'))); console.log('inputs',ids.join(','));
    const am=p.locator('[data-test-id="input_adjustment_amount"] input, input[data-test-id="input_adjustment_amount"]').first(); await am.click(); await am.fill(String(a.val)); }
  else { const v=p.locator('[data-test-id="input_adjustment_percent"] input, input[data-test-id="input_adjustment_percent"]').first(); await v.click(); await v.fill(String(a.val)); }
  await p.waitForTimeout(800); console.log(a.name,'preview',await p.locator('[data-test-id="adjustment_preview"]').innerText().catch(()=>'-'));
  await p.locator('[data-test-id="button_add_adjustment"]').first().click(); await p.waitForTimeout(4000);
  console.log('  toasts',await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' | ')));
}
console.log(caps.join('\n')); await s.close(); process.exit(0);

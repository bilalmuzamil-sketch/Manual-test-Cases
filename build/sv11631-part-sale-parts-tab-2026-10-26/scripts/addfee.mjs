// On screen: part row menu -> Add Part Fee / Discount -> fill -> save. usage: node addfee.mjs <partSaleId> <rowIndex> <fee|discount> [dry]
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const [ps,idx,kind,dry]=process.argv.slice(2);
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:(process.env.QA_DIR||'/tmp/qa26'),vp:{width:1440,height:900}}); const p=s.page;
const caps=[]; p.on('response',async r=>{ if(r.request().method()==='POST'&&/shopview\.com\/api\//.test(r.url())&&!/recent-entities/.test(r.url())) caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(r.request().postData()||'').slice(0,300)+' => '+(await r.text().catch(()=>'')).slice(0,200)); });
await s.go(`/parts/part-sale/${ps}/part-requests`); await p.waitForTimeout(6000);
await p.locator('[data-test-id^="button_part_request_menu_"]').nth(+idx).click(); await p.waitForTimeout(1000);
await p.locator('[data-test-id^="menu_item_add_part_adjustment_"]').first().click(); await p.waitForTimeout(2000);
const D=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||e.value||'').replace(/\s+/g,' ').trim().slice(0,40)));
console.log('dialog',D.join(' ;; ')); await p.screenshot({path:'/tmp/qa11631/addfee-dialog.png'});
if(!dry){
  const l=p.locator('[data-test-id="input_adjustment_name"] input, input[data-test-id="input_adjustment_name"]').first(); await l.click(); await l.fill('ZZAUTOTEST part '+kind);
  if(kind!=='fee'){ await p.locator('[data-test-id="select_adjustment_type"]').first().click(); await p.waitForTimeout(900); await p.locator('.q-menu .q-item',{hasText:/Discount/}).first().click(); await p.waitForTimeout(800); }
  const a=p.locator('[data-test-id="input_adjustment_percent"] input, input[data-test-id="input_adjustment_percent"]').first(); await a.click(); await a.fill(kind==='fee'?'5':'2'); await p.waitForTimeout(800);
  console.log('preview',await p.locator('[data-test-id="adjustment_preview"]').innerText().catch(()=>'-'));
  await p.screenshot({path:'/tmp/qa11631/addfee-'+kind+'-filled.png'});
  await p.locator('[data-test-id="button_add_adjustment"]').first().click(); await p.waitForTimeout(4000);
  console.log('toasts',await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' | ')));
  console.log(caps.join('\n')); await p.screenshot({path:'/tmp/qa11631/addfee-'+kind+'-after.png'}); }
await s.close();

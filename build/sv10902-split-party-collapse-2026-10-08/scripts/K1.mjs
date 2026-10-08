import {ob} from './lib.mjs'; import {mk} from './Klib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const {p,R,box,click,pickItem,notif,dlg,openBank}=mk(s);
await openBank(); await click('button_card_menu_accounting_bank_transactions_'+R.bank); await click('button_card_import_accounting_bank_transactions_'+R.bank); await p.waitForTimeout(1500);
await p.setInputFiles('input[type=file]','rows-k.csv'); await p.waitForTimeout(600);
const ib=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(x=>x.innerText.trim()==='Import'); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await p.mouse.click(ib.x,ib.y); await p.waitForTimeout(4000); console.log('import',await notif());
const rows=(await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=40')).json.bank_transactions; const K=rows.find(t=>t.description.startsWith('ZZ10902-K')); R.rows.K=K.id; fs.writeFileSync('ids.json',JSON.stringify(R,null,1)); console.log('K',K.id,'cat',K.category_account_name,'party',K.party?.name);
// rule 1 on screen
await p.goto(s.host.app+'/accounting/banking/rules',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(4000);
await click('button_new_accounting_bank_rules'); await p.waitForTimeout(1200);
await p.fill('[data-test-id="input_name_accounting_bank_rule"]','ZZAUTOTEST SV-10902 K set Acme'); await p.fill('[data-test-id="input_pattern_accounting_bank_rule"]','ZZ10902-K');
await click('radio_party_action_set_accounting_bank_rule'); await p.waitForTimeout(800);
console.log('dialog after set',JSON.stringify(await dlg()).slice(0,1500));
await p.screenshot({path:'K1-rule-dialog.png'});
await s.close();

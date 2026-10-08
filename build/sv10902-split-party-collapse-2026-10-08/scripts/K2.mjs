import {ob} from './lib.mjs'; import {mk} from './Klib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const {p,R,box,click,pickItem,notif,dlg,openBank}=mk(s); const K=R.rows.K;
export const rule=async(name,who,cat)=>{ await p.goto(s.host.app+'/accounting/banking/rules',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(4000);
 await click('button_new_accounting_bank_rules'); await p.waitForTimeout(1200);
 await p.fill('[data-test-id="input_name_accounting_bank_rule"]',name); await p.fill('[data-test-id="input_pattern_accounting_bank_rule"]','ZZ10902-K');
 if(who){ await click('radio_party_action_set_accounting_bank_rule'); await click('select_party_accounting_bank_rule'); await p.keyboard.type(who); await p.waitForTimeout(1200); await pickItem(who); }
 if(cat){ await click('select_category_accounting_bank_rule'); await p.keyboard.type(cat); await p.waitForTimeout(1200); await pickItem(cat); }
 await click('checkbox_apply_now_accounting_bank_rule'); await p.screenshot({path:`K-${name.slice(-12).replace(/\W/g,'_')}.png`});
 await click('button_save_accounting_bank_rule'); await p.waitForTimeout(3000); return notif(); };
console.log('rule1',await rule('ZZAUTOTEST SV-10902 K set Acme','ZZ Acme'));
const t=(await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=40')).json.bank_transactions.find(x=>x.id===K); console.log('K party',t.party?.name,'cat',t.category_account_name);
await openBank(); await click('button_actions_accounting_bank_transactions_'+K); await click('button_split_accounting_bank_transactions_'+K); await p.waitForTimeout(1500);
console.log('split dialog',JSON.stringify(await dlg()).slice(0,2500)); await p.screenshot({path:'K2-split-open.png'});
await s.close();

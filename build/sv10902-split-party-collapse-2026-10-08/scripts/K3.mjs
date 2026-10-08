import {ob} from './lib.mjs'; import {mk} from './Klib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const {p,R,box,click,pickItem,notif,dlg,openBank}=mk(s); const K=R.rows.K;
const st=async()=>{ for(const tab of ['for_review','categorized']){ const t=(await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=40&tab='+tab)).json.bank_transactions.find(x=>x.id===K); if(t) return {tab,party:t.party?.name||null,cat:t.category_account_name,lines:t.splits.map(x=>x.party?.name||null)}; } };
const rule=async(name,who,cat)=>{ await p.goto(s.host.app+'/accounting/banking/rules',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(4000);
 await click('button_new_accounting_bank_rules'); await p.waitForTimeout(1200);
 await p.fill('[data-test-id="input_name_accounting_bank_rule"]',name); await p.fill('[data-test-id="input_pattern_accounting_bank_rule"]','ZZ10902-K');
 if(who){ await click('radio_party_action_set_accounting_bank_rule'); await click('select_party_accounting_bank_rule'); await p.keyboard.type(who); await p.waitForTimeout(1200); await pickItem(who); }
 if(cat){ await click('select_category_accounting_bank_rule'); await p.keyboard.type(cat); await p.waitForTimeout(1200); await pickItem(cat); }
 await click('checkbox_apply_now_accounting_bank_rule'); await p.screenshot({path:`K3-${name.replace(/\W/g,'_').slice(-14)}.png`}); await click('button_save_accounting_bank_rule'); await p.waitForTimeout(3000); return notif(); };
const line=async(i,acct,amt)=>{ await click(`select_split_account_${i}_accounting_bank_splits`); await p.keyboard.type(acct); await p.waitForTimeout(1000); await pickItem(acct); await p.fill(`[data-test-id="input_split_amount_${i}_accounting_bank_splits"] input, input[data-test-id="input_split_amount_${i}_accounting_bank_splits"]`,amt).catch(async()=>{ await click(`input_split_amount_${i}_accounting_bank_splits`); await p.keyboard.press('Control+A'); await p.keyboard.type(amt);}); };
// split 2 lines
await openBank(); await click('button_actions_accounting_bank_transactions_'+K); await click('button_split_accounting_bank_transactions_'+K); await p.waitForTimeout(1500);
await line(0,'5100 Shop Supplies','60.00'); await line(1,'6100 Insurance','40.00'); await p.waitForTimeout(500); await p.screenshot({path:'K3-split1.png'});
await click('button_save_accounting_bank_splits'); await p.waitForTimeout(3000); console.log('split1',await notif(), JSON.stringify(await st()));
console.log('rule2',await rule('ZZAUTOTEST SV-10902 K set Bob','ZZ Bob')); console.log('after rule2',JSON.stringify(await st()));
// reopen split, add 3rd line
await openBank(); await click('button_split_summary_accounting_bank_transactions_'+K); await p.waitForTimeout(1500);
await click('button_add_split_accounting_bank_splits'); await p.waitForTimeout(800);
for(const [i,a] of [[0,'50.00'],[1,'30.00']]){ await click(`input_split_amount_${i}_accounting_bank_splits`); await p.keyboard.press('Control+A'); await p.keyboard.type(a); }
await line(2,'6000 Wages','20.00'); await p.waitForTimeout(500); await p.screenshot({path:'K3-split2.png'});
await click('button_save_accounting_bank_splits'); await p.waitForTimeout(3000); console.log('split2',await notif(), JSON.stringify(await st()));
console.log('rule3',await rule('ZZAUTOTEST SV-10902 K category only',null,'6110 Sales Tax Expense')); console.log('after rule3',JSON.stringify(await st()));
await openBank(); await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(300); await p.screenshot({path:'K3-list-after.png'});
const g=await p.evaluate(id=>{const c=document.querySelector(`[data-test-id="cell_accounting_bank_transactions_${id}_party"]`); const q=c.getBoundingClientRect(); return {party:[q.x,q.y,q.width,q.height].map(Math.round),text:c.closest('tr').innerText.replace(/\s+/g,' ')};},K); console.log('geo',JSON.stringify(g));
await s.close();

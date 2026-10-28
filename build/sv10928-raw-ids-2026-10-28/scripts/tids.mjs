// node tids.mjs <env> <path> [click:<tid>|clickp:<prefix>|wait:<ms> ...] — lists distinct data-test-ids (ids collapsed) after the steps
import {open} from '../../testing-tools/qa-session.mjs'; import {click} from './scenarios.mjs'; import fs from 'fs';
const [env,path,...steps]=process.argv.slice(2);
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
await s.go(path); await s.page.waitForTimeout(4000);
const NAV=/nav|module_|skip-to|global_search|clock_in|notifications|profile_menu|item_label|item_value|financial_info|text_wo|badge_wo|select_lead|select_service|select_sales|customer_card|vehicle_card|link_customer|select_customer_contact|select_authorizer|button_copy_vin|input_vehicle|fault-codes|link_.*_tab|button_back/;
const list=async()=>[...new Set(await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;}).map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi,'<id>'))))].filter(t=>!NAV.test(t));
for(const st of steps){ const [k,v]=st.split(/:(.*)/s);
  try{ if(k==='click') await click(s,v); else if(k==='clickp') await click(s,v,{prefix:true}); else if(k==='wait') await s.page.waitForTimeout(+v); else if(k==='go') await s.go(v); }catch(e){ console.log('step fail',st,e.message.slice(0,100)); }
  await s.page.waitForTimeout(2500); }
console.log('URL',s.page.url().replace(s.host.app,'').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi,'<id>')); console.log((await list()).join(' ; ').slice(0,3500));
if(process.env.SHOT) await s.page.screenshot({path:process.env.SHOT});
await s.close();

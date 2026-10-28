// Settings → Fees & Discounts → New → a plain flat fee template, on screen; prints the request it sends.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const LOC='b617914c-16e9-4485-8e8b-193cd86aa416';
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const p=s.page; if(env==='prod'){ await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
await s.go('/administration/adjustment-templates'); await p.waitForTimeout(4000); await p.locator('[data-test-id="button_new_adjustment_template"]').click(); await p.waitForTimeout(1500);
const sel=async(t,txt)=>{ await p.locator(`[data-test-id="${t}"]`).click(); await p.waitForTimeout(700); const o=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim())); console.log(t,JSON.stringify(o)); await p.locator('.q-menu .q-item',{hasText:txt}).first().click(); await p.waitForTimeout(500); };
const fill=async(t,v)=>{ const l=p.locator(`[data-test-id="${t}"]`); await ((await l.evaluate(e=>e.tagName))==='INPUT'?l:l.locator('input')).fill(v); await p.waitForTimeout(300); };
await sel('select_adjustment_template_type','Fee'); await sel('select_adjustment_template_calc_type','Flat');
await fill('input_adjustment_template_name','ZZAUTOTEST SV10928 plain fee'); await fill('input_adjustment_template_amount','5');
const w0=s.writes.length; await p.locator('[data-test-id="button_save_adjustment_template"]').click(); await p.waitForTimeout(3000);
console.log('writes',JSON.stringify(s.writes.slice(w0).filter(w=>!/envelope/.test(w)).map(w=>w.slice(0,400))));
await s.close(); process.exit(0);

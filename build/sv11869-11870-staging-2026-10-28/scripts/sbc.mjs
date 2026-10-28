// Reports → Sales By Customer → download the CSV on screen. Usage: ENVX=staging|prod node sbc.mjs <out.csv>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const out=process.argv[2]; const env=process.env.ENVX||'staging'; const LOC=env==='prod'?'b617914c-16e9-4485-8e8b-193cd86aa416':'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const s=await open({env,ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1440,height:900}});
const p=s.page; await s.go('/reports'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); await s.go('/reports/sales-by-customer'); await p.waitForTimeout(6000);
const ids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')))].filter(t=>/export|download|csv|pdf/i.test(t))); console.log('export ids',ids.join(' ; '));
const eb=p.locator(`[data-test-id="${ids.find(t=>/^btn_dropdown_.*export/.test(t))||ids.find(t=>/export|download/i.test(t)&&!/report_nav/.test(t))}"]`).first(); await eb.click(); await p.waitForTimeout(1200);
const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-dialog [data-test-id]')].map(e=>(e.getAttribute('data-test-id')||'')+'|'+e.innerText.replace(/\s+/g,' ').trim()).slice(0,12)); console.log('menu',JSON.stringify(items));
const csvItem=p.locator('.q-menu .q-item',{hasText:/CSV/i}).first();
const [dl]=await Promise.all([p.waitForEvent('download',{timeout:60000}),csvItem.click()]); await dl.saveAs(out); console.log('saved',dl.suggestedFilename(),fs.statSync(out).size);
await s.close(); process.exit(0);

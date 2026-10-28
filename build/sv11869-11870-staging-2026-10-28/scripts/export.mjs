// On screen: Reports → Export Reports → Report Name <name> → Date Range <range> → Export; saves the download. Usage: node export.mjs "<Report Name>" "<range>" <outfile>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [rep,range,outf]=process.argv.slice(2); const LOC=process.env.LOC||'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const s=await open({env:process.env.ENVX||'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync(process.env.CK||'/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1440,height:900}});
const p=s.page; await s.go('/reports'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); await s.go('/reports'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="report_nav_export_reports"]').click(); await p.waitForTimeout(2000);
const pick=async(t,txt)=>{ await p.locator(`.q-dialog [data-test-id="${t}"]`).click(); await p.waitForTimeout(800); const o=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim())); console.log(t,JSON.stringify(o)); await p.locator('.q-menu .q-item',{hasText:txt}).first().click(); await p.waitForTimeout(800); };
await pick('select_report_name',rep); await pick('select_date_range',range);
await p.screenshot({path:outf.replace(/\.[a-z]+$/,'')+'-dialog.png'});
const [dl]=await Promise.all([p.waitForEvent('download',{timeout:60000}),p.locator('.q-dialog [data-test-id="button_confirm_dialog"]').click()]);
await dl.saveAs(outf); console.log('saved',outf,dl.suggestedFilename(),fs.statSync(outf).size);
await s.close(); process.exit(0);

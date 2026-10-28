// On screen: New Line → Title typed (free text) + Description → Line Approved → Save & Close. Prints the request sent.
// Usage: node addline.mjs <woId> <title> <description>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [wo,title,desc]=process.argv.slice(2);
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1440,height:900}});
const p=s.page; await s.go('/workorders'); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('b3c8c820-f815-4cf1-8938-10956c5ee71a'))); await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(4000);
if(!(await p.locator('.q-dialog [data-test-id="select_line_canned_line"]').count())){ const nb=p.locator('[data-test-id="button_new_line"], [data-test-id="button_add_line"]'); console.log('new line btns',await nb.count(), JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>/New Line/.test(e.innerText)).map(e=>e.getAttribute('data-test-id'))))); await (await nb.count()?nb.first():p.getByRole('button',{name:'New Line'}).first()).click(); await p.waitForTimeout(1500); }
await p.locator('.q-dialog [data-test-id="select_line_canned_line"]').click(); await p.waitForTimeout(400);
await p.keyboard.type(title,{delay:50}); await p.waitForTimeout(1500);
console.log('menu',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,4))));
await p.keyboard.press('Tab'); await p.waitForTimeout(600);
const d=p.locator('.q-dialog [data-test-id="input_line_description"]'); await ((await d.evaluate(e=>['INPUT','TEXTAREA'].includes(e.tagName)))?d:d.locator('input,textarea')).fill(desc); await p.waitForTimeout(400);
console.log('title field',JSON.stringify(await p.evaluate(()=>document.querySelector('.q-dialog [data-test-id="select_line_canned_line"]')?.closest('.q-field')?.innerText.replace(/\s+/g,' '))));
await p.locator('.q-dialog [data-test-id="checkbox_line_approved"]').click(); await p.waitForTimeout(300);
const full=[]; p.on('request',r=>{ if(/lines\/create/.test(r.url())) full.push(r.postData()); }); const w0=s.writes.length; await p.locator('.q-dialog [data-test-id="button_save_close"]').click(); await p.waitForTimeout(3500);
console.log('writes',JSON.stringify(s.writes.slice(w0).filter(w=>!/envelope|touch/.test(w)).map(w=>w.slice(0,700))));
console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')))));
await p.screenshot({path:'/tmp/qa30/line-saved.png'}); if(full[0]) fs.writeFileSync('/tmp/qa30/line-payload.json',full[0]);
await s.close(); process.exit(0);

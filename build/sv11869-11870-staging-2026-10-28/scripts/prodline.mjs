// Production: open a work order's New Line window and read its first field (title vs "What are you doing?").
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const LOC='b617914c-16e9-4485-8e8b-193cd86aa416';
const s=await open({env:'prod',ticket:'x',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa25',user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const p=s.page; await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC);
await s.go('/workorders/6e6ef378-80ab-4ed3-bd86-ddf72bbcedf2/lines'); await p.waitForTimeout(5000);
if(!(await p.locator('.q-dialog').count())) await p.locator('[data-test-id="button_new_line"]').click(); await p.waitForTimeout(2000);
console.log('dialog',await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,300)));
await p.screenshot({path:'ev/prod-new-line.png'}); console.log(JSON.stringify(await s.marker()));
await s.close(); process.exit(0);

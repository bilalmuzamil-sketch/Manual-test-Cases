import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
const p=s.page; await s.go('/reports'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="report_nav_export_reports"]').click(); await p.waitForTimeout(2500);
const ids=()=>p.evaluate(()=>[...new Set([...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')))].join(' ; '));
console.log('dialog',await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,400))); console.log('ids',await ids());
const sel=p.locator('.q-dialog .q-select, .q-dialog [data-test-id^="select_"]').first(); if(await sel.count()){ await sel.click(); await p.waitForTimeout(1000); console.log('options',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim())))); await p.keyboard.press('Escape'); }
await p.screenshot({path:'/tmp/qa30/export-dialog.png'});
await s.close(); process.exit(0);

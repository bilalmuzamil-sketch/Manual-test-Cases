import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(6000);
console.log('wo controls',await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/sales|priority|rep|authoriz|lead|advisor/i.test(t)))].join(' ; ')));
await p.locator('[data-test-id="profile_menu_button"]').click(); await p.waitForTimeout(1500);
console.log('profile menu',await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.replace(/\s+/g,' ').trim().slice(0,40)).slice(0,20).join(' ; ')));
await s.close(); process.exit(0);

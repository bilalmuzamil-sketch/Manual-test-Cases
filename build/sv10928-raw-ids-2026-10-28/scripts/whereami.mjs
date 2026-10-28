import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
await s.go('/workorders'); await s.page.waitForTimeout(3000);
console.log('ls location',await s.page.evaluate(()=>localStorage.getItem('location')?.slice(0,200)));
console.log('select_location',await s.page.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.replace(/\s+/g,' ')));
await s.close(); process.exit(0);

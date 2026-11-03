import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',dir:'/tmp/qa52',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900},tz:'Pacific/Kiritimati'}); const p=s.page;
await s.go('/workorders'); await p.waitForTimeout(3500);
await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1000);
await p.click('[data-test-id="select_location"]'); await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, [role=option]')].map(e=>e.innerText.replace(/\n/g,' / ')))));
await p.screenshot({path:'/tmp/sv11970/locmenu.png'});
await s.close(); process.exit(0);

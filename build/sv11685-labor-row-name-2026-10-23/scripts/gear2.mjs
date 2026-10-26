import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:2});
const p=s.page; await s.go('/workorders/f94beef2-ce77-4ec3-8d23-be8fb787348f/finance'); await p.waitForTimeout(7000);
await p.click('[data-test-id="button_invoice_settings"]'); await p.waitForTimeout(1500); await p.mouse.move(1000,600); await p.waitForTimeout(1500);
const b=await p.evaluate(()=>{const els=['laborRate','laborCost'].map(k=>document.querySelector(`[data-test-id="toggle_setting_${k}"]`).closest('.q-item')||document.querySelector(`[data-test-id="toggle_setting_${k}"]`)); const m=document.querySelector('.q-menu').getBoundingClientRect(); const a=els[0].getBoundingClientRect(), c=els[1].getBoundingClientRect(); return {menu:[m.x,m.y,m.width,m.height],top:a.y,bottom:c.y+c.height};});
fs.writeFileSync('/tmp/qa11685/w/ui1026/gear2.json',JSON.stringify(b)); console.log(JSON.stringify(b));
await p.screenshot({path:'/tmp/qa11685/w/ui1026/gear2.png'}); await p.keyboard.press('Escape');
process.exit(0);

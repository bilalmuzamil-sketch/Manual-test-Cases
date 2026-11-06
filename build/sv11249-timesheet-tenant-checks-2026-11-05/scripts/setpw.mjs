// usage: ORG=B node setpw.mjs -> opens the org-B invitation link, sets the password from /tmp/sv11249/pwB.txt, prints the result
import {sess,rd} from './common.mjs'; import fs from 'fs'; const s=await sess({noLogin:true}); const P=s.page; const log=[];
P.on('response',async r=>{const u=r.url(); if(/\/api\//.test(u)&&r.request().method()!=='GET') log.push(r.request().method()+' '+r.status()+' '+u.split('/api')[1].slice(0,60)+' '+(await r.text().catch(()=>'')).slice(0,160));});
const link=rd('sv11249','invite.txt').replace('http://','https://'); const pw=rd('sv11249','pwB.txt');
await P.goto(link,{waitUntil:'domcontentloaded',timeout:60000}); const ok=await s.waitFor('input_password'); console.log('form',ok,P.url().split('?')[0]);
if(ok){ await P.locator('input[data-test-id="input_password"], [data-test-id="input_password"] input').first().fill(pw);
await P.locator('input[data-test-id="input_repeat_password"], [data-test-id="input_repeat_password"] input').first().fill(pw);
const b=await s.box('button_login'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(7000); }
console.log('url',P.url().split('?')[0]); console.log(log.join('\n').slice(0,1000)); await s.close(); process.exit(0);

// ShopCoach AI Analyze with the per-line review request forced to fail IN THIS BROWSER ONLY (diagnostic) — read the pop-up
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const seen=[]; await p.route(/shopcoach/i, async (route,req)=>{ const b=req.postData()||''; seen.push(req.method()+' '+req.url().replace(/^https:\/\/[^/]+/,'')+' '+b.slice(0,120));
  if(/analyze-line|analyze_line|analyzeLine|line-review|lines\/.*\/analy/i.test(req.url()+b)) return route.fulfill({status:500,contentType:'application/json',body:JSON.stringify({message:'Forced failure (QA diagnostic)'})}); return route.continue(); });
await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(7000);
const has=await p.locator('[data-test-id="ai_analyze_button"]').count(); console.log('ai button',has);
if(has){ await p.locator('[data-test-id="ai_analyze_button"]').first().click(); await p.waitForTimeout(2500);
  const dlg=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id], .q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'|'+e.innerText.replace(/\s+/g,' ').slice(0,40)).join(' ;; ')); console.log('after click',dlg.slice(0,600));
  for(let i=0;i<25;i++){ const n=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim())); if(n.length){ console.log('notifications',JSON.stringify(n)); await p.screenshot({path:`/tmp/s10928/scfail-${env}.png`}); break; } await p.waitForTimeout(1000); } }
console.log(seen.join('\n').slice(0,1500)); await s.close(); process.exit(0);

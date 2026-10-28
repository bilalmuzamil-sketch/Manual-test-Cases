// Detached QuickBooks sign-in that waits for a HUMAN to answer the picture puzzle.
// Each round: numbered screenshot -> /tmp/qa31/captcha-<n>.png and /tmp/qa31/state.txt = WAITING <n>.
// Answer file /tmp/qb-answer.txt: "1,4,7" (click those tiles), "verify", "reload". Then OTP via /tmp/qb-otp.txt if asked.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const {chromium}=pkg; import fs from 'fs'; import {spawnSync} from 'child_process';
const dir='/tmp/qa31', here='/home/user/Manual-test-Cases/build/testing-tools', ev='/home/user/Manual-test-Cases/build/sv11869-11870-staging-2026-10-28/ev/qb';
const st=t=>{ fs.writeFileSync(dir+'/state.txt',t); fs.appendFileSync(dir+'/hold.log',new Date().toISOString()+' '+t+'\n'); };
spawnSync('bash',['-c',`cd ${here} && (setsid nohup node staging-bridge.mjs > ${dir}/bridge.log 2>&1 < /dev/null &) ; for i in $(seq 1 10); do sleep 1; P=$(grep -o 'BRIDGE_LISTENING 127.0.0.1:[0-9]*' ${dir}/bridge.log | cut -d: -f2); [ -n "$P" ] && break; done; echo -n $P > ${dir}/port.txt`],{timeout:20000});
const port=fs.readFileSync(dir+'/port.txt','utf8').trim();
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--proxy-server=http://127.0.0.1:'+port,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await b.newContext({viewport:{width:1440,height:950},ignoreHTTPSErrors:true,timezoneId:'Asia/Karachi',userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'});
const p=await ctx.newPage(); const txt=()=>p.evaluate(()=>document.body?.innerText.replace(/\s+/g,' ').slice(0,300)).catch(()=>'');
const waitFile=async(f,mins)=>{ for(let i=0;i<mins*12;i++){ if(fs.existsSync(f)){ const v=fs.readFileSync(f,'utf8').trim(); fs.unlinkSync(f); return v; } await p.waitForTimeout(5000);} return null; };
await p.goto('https://app.sandbox.qbo.intuit.com/app/invoices',{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{}); await p.waitForTimeout(8000);
await p.locator('input[name="Email"]').first().fill('Bilal.muzamil@shopview.com').catch(()=>{}); await p.locator('button[type=submit]').first().click().catch(()=>{}); await p.waitForTimeout(7000);
const anchor=p.frameLocator('iframe[title*="reCAPTCHA"]').first().locator('#recaptcha-anchor');
if(/not a robot/i.test(await txt())){
  await anchor.click({timeout:15000}).catch(()=>{}); await p.waitForTimeout(5000);
  for(let round=1; round<=25; round++){
    if((await anchor.getAttribute('aria-checked').catch(()=>null))==='true') break;
    const cf=p.frames().find(f=>/bframe/.test(f.url())); if(!cf){ st('NO_CHALLENGE_FRAME'); break; }
    await cf.evaluate(()=>{ document.querySelectorAll('.zz-n').forEach(e=>e.remove()); [...document.querySelectorAll('td.rc-imageselect-tile')].forEach((td,i)=>{ const s=document.createElement('div'); s.className='zz-n'; s.textContent=i+1; s.style.cssText='position:absolute;left:4px;top:4px;background:#ffeb3b;color:#000;font:bold 22px sans-serif;padding:2px 8px;border-radius:4px;z-index:99;pointer-events:none'; td.style.position='relative'; td.appendChild(s); }); }).catch(()=>{});
    const fe=await p.$('iframe[title*="challenge"]'); await (fe? fe.screenshot({path:`${dir}/captcha-${round}.png`}) : p.screenshot({path:`${dir}/captcha-${round}.png`}));
    fs.copyFileSync(`${dir}/captcha-${round}.png`,`${ev}/captcha-round-${round}.png`);
    st('WAITING '+round); const a=await waitFile('/tmp/qb-answer.txt',60); if(a===null){ st('TIMEOUT'); await b.close(); process.exit(0); }
    await cf.evaluate(()=>document.querySelectorAll('.zz-n').forEach(e=>e.remove())).catch(()=>{});
    if(/^verify/i.test(a)) await cf.locator('#recaptcha-verify-button').click().catch(()=>{});
    else if(/^reload/i.test(a)) await cf.locator('#recaptcha-reload-button').click().catch(()=>{});
    else { const tiles=cf.locator('td.rc-imageselect-tile'); for(const n of a.split(/[ ,]+/).map(Number).filter(Boolean)){ await tiles.nth(n-1).click().catch(()=>{}); await p.waitForTimeout(700); } if(/v$/i.test(a)) await cf.locator('#recaptcha-verify-button').click().catch(()=>{}); }
    await p.waitForTimeout(5000);
  }
}
const ok=(await anchor.getAttribute('aria-checked').catch(()=>null))==='true'; st('CAPTCHA '+(ok?'PASSED':'NOT PASSED'));
if(ok){ await p.locator('button:has-text("Continue"),button[type=submit]').first().click().catch(()=>{}); await p.waitForTimeout(8000);
  await p.locator('input[type=password]').first().fill(fs.readFileSync('/tmp/qb-pw.txt','utf8')).catch(()=>{});
  await p.locator('[data-testid="passwordVerificationContinueButton"],button[type=submit]').first().click().catch(()=>{}); await p.waitForTimeout(9000);
  await p.screenshot({path:`${ev}/after-password.png`}); st('AFTER_PASSWORD '+(await txt()));
  if(/code|verify|verification/i.test(await txt())){ await p.screenshot({path:`${dir}/otp.png`}); st('OTP_WAIT '+(await txt()));
    const code=await waitFile('/tmp/qb-otp.txt',30); if(code){ await p.locator('input[autocomplete="one-time-code"],input[inputmode="numeric"],input[type=tel],input[type=text]').first().fill(code).catch(()=>{}); await p.locator('button[type=submit],button:has-text("Continue"),button:has-text("Verify")').first().click().catch(()=>{}); await p.waitForTimeout(12000); } }
  await ctx.storageState({path:dir+'/qb-state.json'});
  await p.goto('https://app.sandbox.qbo.intuit.com/app/invoices',{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{}); await p.waitForTimeout(15000);
  await p.screenshot({path:`${ev}/qb-invoices.png`}); st('INVOICES '+(await txt()));
  // stay alive for follow-up commands (an /tmp/qb-cmd.txt URL to open), up to 60 min
  for(let i=0;i<60;i++){ const u=await waitFile('/tmp/qb-cmd.txt',1); if(u){ await p.goto(u,{waitUntil:'domcontentloaded'}).catch(()=>{}); await p.waitForTimeout(12000); await p.screenshot({path:`${ev}/qb-cmd-${i}.png`,fullPage:true}); fs.writeFileSync(dir+'/cmd-out.txt',await p.evaluate(()=>document.body.innerText).catch(()=>'')); st('CMD_DONE '+i); } }
}
await b.close(); process.exit(0);

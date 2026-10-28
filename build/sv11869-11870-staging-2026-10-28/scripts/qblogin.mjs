// Sign in to the QuickBooks sandbox (Intuit) through the egress bridge and land on the invoice list. Screens to ev/qb/.
// Password from /tmp/qb-pw.txt; OTP (if asked) from /tmp/qb-otp.txt (poll). Never prints the password.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const {chromium}=pkg; import fs from 'fs'; import {spawnSync} from 'child_process';
const dir='/tmp/qa31', here='/home/user/Manual-test-Cases/build/testing-tools';
spawnSync('bash',['-c',`cd ${here} && (setsid nohup node staging-bridge.mjs > ${dir}/bridge.log 2>&1 < /dev/null &) ; for i in $(seq 1 10); do sleep 1; P=$(grep -o 'BRIDGE_LISTENING 127.0.0.1:[0-9]*' ${dir}/bridge.log | cut -d: -f2); [ -n "$P" ] && break; done; echo -n $P > ${dir}/port.txt`],{timeout:20000});
const port=fs.readFileSync(dir+'/port.txt','utf8').trim();
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--proxy-server=http://127.0.0.1:'+port,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await b.newContext({viewport:{width:1440,height:950},ignoreHTTPSErrors:true,timezoneId:'Asia/Karachi',userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'});
const p=await ctx.newPage(); let n=0; const shot=async t=>{ await p.screenshot({path:`ev/qb/${String(++n).padStart(2,'0')}-${t}.png`}); console.log('SHOT',n,t,p.url().slice(0,120)); };
const txt=()=>p.evaluate(()=>document.body?.innerText.replace(/\s+/g,' ').slice(0,400)).catch(()=>'');
await p.goto('https://app.sandbox.qbo.intuit.com/app/invoices',{waitUntil:'domcontentloaded',timeout:90000}).catch(e=>console.log('goto',e.message));
await p.waitForTimeout(8000); await shot('start'); console.log(await txt());
const fillFirst=async(sels,v)=>{ for(const s of sels){ const l=p.locator(s).first(); if(await l.count().catch(()=>0)){ await l.fill(v).catch(()=>{}); return s; } } return null; };
const clickFirst=async(sels)=>{ for(const s of sels){ const l=p.locator(s).first(); if(await l.count().catch(()=>0) && await l.isVisible().catch(()=>false)){ await l.click().catch(()=>{}); return s; } } return null; };
console.log('email field',await fillFirst(['input[name="Email"]','#iux-identifier-first-international-email-user-id-input','input[type=email]','input[autocomplete="username"]','input[name="Username"]'],'Bilal.muzamil@shopview.com'));
console.log('click',await clickFirst(['button[type=submit]','[data-testid="IdentifierFirstSubmitButton"]','button:has-text("Sign in")','button:has-text("Continue")']));
await p.waitForTimeout(7000); await shot('after-email'); console.log(await txt());
if(/not a robot/i.test(await txt())){
  const fr=p.frameLocator('iframe[title*="reCAPTCHA"]').first();
  await fr.locator('#recaptcha-anchor').click({timeout:15000}).catch(e=>console.log('cb',e.message));
  await p.waitForTimeout(6000); await shot('captcha-clicked');
  const checked=await fr.locator('#recaptcha-anchor').getAttribute('aria-checked').catch(()=>null); console.log('captcha checked',checked);
  const challenge=await p.locator('iframe[title*="challenge"]').count(); console.log('image challenge frames',challenge);
  if(checked!=='true'){ console.log('STOP: picture challenge or not ticked'); await b.close(); process.exit(0); }
  console.log('continue',await clickFirst(['button:has-text("Continue")','button[type=submit]']));
  await p.waitForTimeout(8000); await shot('after-captcha'); console.log(await txt());
}
const pw=fs.readFileSync('/tmp/qb-pw.txt','utf8');
console.log('pw field',await fillFirst(['input[type=password]','input[name="Password"]'],pw));
console.log('click',await clickFirst(['[data-testid="passwordVerificationContinueButton"]','button[type=submit]','button:has-text("Continue")','button:has-text("Sign in")']));
await p.waitForTimeout(9000); await shot('after-password'); console.log(await txt());
// OTP step: wait up to 10 min for /tmp/qb-otp.txt
if(/code|verify|verification/i.test(await txt())){
  await clickFirst(['button:has-text("Continue")','[data-testid="challengePickerOption_EMAIL"]','button:has-text("Email")']).catch(()=>{});
  await p.waitForTimeout(4000); await shot('otp-prompt'); console.log('OTP_WAIT', await txt());
  for(let i=0;i<120 && !fs.existsSync('/tmp/qb-otp.txt');i++) await p.waitForTimeout(5000);
  if(fs.existsSync('/tmp/qb-otp.txt')){ const code=fs.readFileSync('/tmp/qb-otp.txt','utf8').trim();
    console.log('otp field',await fillFirst(['input[name="Verification code"]','input[autocomplete="one-time-code"]','input[inputmode="numeric"]','input[type=tel]','input[type=text]'],code));
    console.log('click',await clickFirst(['button[type=submit]','button:has-text("Continue")','button:has-text("Verify")']));
    await p.waitForTimeout(12000); await shot('after-otp'); console.log(await txt()); }
}
await ctx.storageState({path:'/tmp/qa31/qb-state.json'});
await p.goto('https://app.sandbox.qbo.intuit.com/app/invoices',{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{}); await p.waitForTimeout(12000); await shot('invoices'); console.log(await txt());
await ctx.storageState({path:'/tmp/qa31/qb-state.json'}); await b.close(); process.exit(0);

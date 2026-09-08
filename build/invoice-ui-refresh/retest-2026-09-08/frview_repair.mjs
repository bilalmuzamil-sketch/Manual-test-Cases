// Flip API-created cases from TestRail's ESCAPING container to `markdown fr-view`
// by re-saving their stored values through the UI editor. Recipe: playbook §J.
// Usage: node frview_repair.mjs <cid> [<cid> ...]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json','utf8'));
const HOST='https://shopview.testrail.io', API=`${HOST}/index.php?/api/v2`;
const AUTH='Basic '+Buffer.from(`${C.email}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const CIDS = process.argv.slice(2).map(Number);
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const LITERAL=/<\s*\/?\s*(p|br|ul|ol|li|hr)\b[^>]*>/i;

const browser = await chromium.launch({
  executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  proxy:{server:`http://127.0.0.1:${port}`},
  args:['--ignore-certificate-errors','--no-first-run','--no-default-browser-check'] });
const ctx = await browser.newContext({ ignoreHTTPSErrors:true });
ctx.on('page', p => p.on('dialog', d => d.accept().catch(()=>{})));
let p0 = await ctx.newPage();
await p0.goto(`${HOST}/index.php?/auth/login/`,{waitUntil:'domcontentloaded'});
await p0.fill('#name', C.email); await p0.fill('#password', C.password);
await p0.click('#button_primary'); await p0.waitForLoadState('networkidle');
if (/auth\/login/.test(p0.url())) { log('LOGIN FAILED'); await browser.close(); process.exit(2); }
log('login ok'); await p0.close();

const results = {};
for (const CID of CIDS) {
  const pre = await (await fetch(`${API}/get_case/${CID}`,{headers:{Authorization:AUTH}})).json();
  if (pre.custom_atmstatus === 3) { log(`C${CID} AUTOMATED - held (Rule 71)`); results[CID]='HELD'; continue; }
  if (![3,6].includes(pre.created_by)) { log(`C${CID} FOREIGN - skipped (Rule 38)`); results[CID]='FOREIGN'; continue; }
  const F = { custom_preconds: pre.custom_preconds||'', custom_steps: pre.custom_steps||'',
              custom_expected: pre.custom_expected||'' };

  const attempt = async () => {
    const p = await ctx.newPage();
    p.on('dialog', d => d.accept().catch(()=>{}));
    try {
      await p.goto(`${HOST}/index.php?/cases/edit/${CID}`,{waitUntil:'networkidle',timeout:60000});
      await p.locator('#custom_expected_display .fr-element').waitFor({state:'visible',timeout:45000});
      const res = await p.evaluate((F) => {
        const put = (field, html) => {
          const inst = window.FroalaEditor.INSTANCES.find(
            i => i.$oel && i.$oel[0] && i.$oel[0].id === field + '_display');
          if (!inst) return false;
          inst.html.set(html);
          try { inst.undo.saveStep(); } catch(e) {}
          try { inst.events.trigger('contentChanged'); } catch(e) {}
          const el = inst.$el && inst.$el[0];
          if (el) { el.dispatchEvent(new Event('input',{bubbles:true}));
                    el.dispatchEvent(new Event('keyup',{bubbles:true})); }
          const b = document.querySelector('#' + field);
          if (b) { b.value = inst.html.get();
                   for (const ev of ['input','change','keyup']) b.dispatchEvent(new Event(ev,{bubbles:true})); }
          return true;
        };
        return Object.entries(F).map(([k,v]) => `${k}=${put(k,v)}`).join(' ');
      }, F);
      if (!res.includes('custom_expected=true')) return {ok:false, why:res, fatal:true};
      try { await p.locator('#accept:not([disabled])').waitFor({state:'visible',timeout:15000}); }
      catch(e) { await p.evaluate(()=>{ const b=document.querySelector('#accept'); if (b) b.removeAttribute('disabled'); }); }
      await p.waitForTimeout(500);
      await p.click('#accept',{timeout:30000, force:true});
      await p.waitForLoadState('networkidle').catch(()=>{});
      for (let w=0; w<80 && /cases\/edit/.test(p.url()); w++) await p.waitForTimeout(500);
      if (/cases\/edit/.test(p.url())) {
        const err = await p.evaluate(()=>[...document.querySelectorAll('.message-error')]
          .map(x=>(x.innerText||'').trim()).filter(Boolean).join(' | ').slice(0,140));
        return {ok:false, why:'SAVE REJECTED: '+(err||'no message')};
      }
      return {ok:true};
    } catch (e) { return {ok:false, why:'ERROR: '+String(e).split('\n')[0].slice(0,110)}; }
    finally { await p.close().catch(()=>{}); }
  };

  let out;
  for (let i=1;i<=3;i++){ out = await attempt(); if (out.ok||out.fatal) break;
    log(`C${CID} attempt ${i} -> ${out.why}`); await new Promise(r=>setTimeout(r,4000*i)); }
  if (!out.ok) { log(`C${CID} -> ${out.why}`); results[CID]='FAILED: '+out.why; continue; }

  const v0 = await ctx.newPage();
  await v0.goto(`${HOST}/index.php?/cases/view/${CID}`,{waitUntil:'networkidle',timeout:60000});
  const v = await v0.evaluate(()=>[...document.querySelectorAll('div[class^="markdown"]')]
    .filter(d=>!d.id).map(d=>({cls:d.className.trim(), text:d.innerText})));
  await v0.close();
  const post = await (await fetch(`${API}/get_case/${CID}`,{headers:{Authorization:AUTH}})).json();
  const containers = v.map(x=>x.cls.includes('fr-view')?'fr-view':'ESCAPING');
  const literal = v.some(x=>LITERAL.test(x.text));
  const titleOk = post.title === pre.title;
  log(`C${CID} saved | containers: ${containers.join(', ')} | literal tags: ${literal} | title unchanged: ${titleOk}`);
  results[CID] = (containers.every(c=>c==='fr-view') && !literal && titleOk) ? 'OK' :
                 `CHECK: ${containers.join(',')} literal=${literal} title=${titleOk}`;
}
console.log('\n=== RESULT ===');
for (const [k,v] of Object.entries(results)) console.log(`C${k}: ${v}`);
await browser.close();
process.exit(Object.values(results).every(v=>v==='OK') ? 0 : 3);

// C45254: change the marker's casing and NOTHING else.
//
// WHY NOT THE NORMAL WRITER: it clears the editor and retypes the field, which would rebuild the
// QA lead's own structure (his field is an <ol> whose second <li> holds the separator, the provenance
// and the marker). Five characters do not justify reshaping his markup. So this uses the recorded
// Froala html.set recipe (build/inline-add-edit-parts/render-repair-2026-08-31/fix_deterministic.mjs,
// Rule 27) to do a surgical string replacement on the stored HTML.
//
// It refuses unless the stored HTML contains EXACTLY the string being replaced, once.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const HOST='https://shopview.testrail.io';
const CID=45254, FROM='AUTOMATION: Ready', TO='AUTOMATION: READY';
const C=JSON.parse(fs.readFileSync('/tmp/testrail/creds.json','utf8'));
const U={email:C.email, ui_password:JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json','utf8')).password};
const AUTH='Basic '+Buffer.from(`${C.email}:${C.password}`).toString('base64');
const api = async p => { const r=await fetch(`${HOST}/index.php?/api/v2/${p}`,{headers:{Authorization:AUTH,'Content-Type':'application/json'}}); return [r.status, await r.json()]; };
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const p=await b.newPage({ignoreHTTPSErrors:true,viewport:{width:1500,height:1200}});
p.setDefaultTimeout(60000);
await p.setExtraHTTPHeaders({'Cache-Control':'no-cache',Pragma:'no-cache'});
await p.goto(`${HOST}/index.php?/auth/login/`,{waitUntil:'domcontentloaded'});
await p.fill('#name',U.email); await p.fill('#password',U.ui_password);
await p.click('#button_primary'); await p.waitForLoadState('networkidle');
if (/auth\/login/.test(p.url())) { console.log('LOGIN FAILED'); await b.close(); process.exit(2); }

const [st0, before] = await api(`get_case/${CID}`);
if (st0!==200) { console.log('pre-GET', st0); await b.close(); process.exit(2); }
const atmBefore=before.custom_atmstatus, secBefore=before.section_id, refsBefore=before.refs||null;
console.log('atmstatus before:', atmBefore);

await p.goto(`${HOST}/index.php?/dashboard`,{waitUntil:'domcontentloaded'}).catch(()=>{});
await p.goto(`${HOST}/index.php?/cases/edit/${CID}&_cb=${Date.now()}`,{waitUntil:'networkidle'});
await p.waitForTimeout(500);

const res = await p.evaluate(([field, from, to]) => {
  const inst = window.FroalaEditor.INSTANCES.find(i => i.$oel && i.$oel[0] && i.$oel[0].id === field + '_display');
  if (!inst) return {err:'no Froala instance for '+field};
  const cur = inst.html.get();
  const n = cur.split(from).length - 1;
  if (n !== 1) return {err:`expected exactly 1 occurrence of ${JSON.stringify(from)}, found ${n}`, cur};
  const next = cur.replace(from, to);
  inst.html.set(next); try { inst.undo.saveStep(); } catch(e) {}
  return {ok:true, changedChars: cur.length===next.length, before:cur, after:next};
}, ['custom_expected', FROM, TO]);
if (res.err) { console.log('REFUSED:', res.err); await b.close(); process.exit(3); }
console.log('froala updated in place; same length =', res.changedChars);

await p.click('#accept'); await p.waitForLoadState('networkidle');
for (let w=0; w<40 && /cases\/edit/.test(p.url()); w++) await p.waitForTimeout(500);
if (/cases\/edit/.test(p.url())) {
  const diag = await p.evaluate(()=>[...document.querySelectorAll('.message-error,.error,[class*="error"]')].map(e=>(e.innerText||'').trim()).filter(Boolean).slice(0,3));
  console.log('STILL ON EDIT PAGE:', JSON.stringify(diag)); await b.close(); process.exit(4);
}

const [st1, after] = await api(`get_case/${CID}`);
const checks = {
  marker_fixed: after.custom_expected.includes(TO) && !after.custom_expected.includes(FROM),
  html_otherwise_identical: after.custom_expected === before.custom_expected.replace(FROM, TO),
  atm_unchanged: after.custom_atmstatus === atmBefore,
  section_unchanged: after.section_id === secBefore,
  refs_unchanged: (after.refs||null) === refsBefore,
};
console.log('post-write checks:', JSON.stringify(checks, null, 1));
const view = await p.goto(`${HOST}/index.php?/cases/view/${CID}`,{waitUntil:'networkidle'}).then(()=>p.evaluate(()=>{
  const ds=[...document.querySelectorAll('div[class^="markdown"]')].filter(d=>!d.id);
  return {count:ds.length, expectedCls: ds[2]?ds[2].className.trim():null, literal:/&lt;|<(p|ol|li)&gt;/.test(ds[2]?ds[2].innerHTML:'')};
}));
console.log('served page:', JSON.stringify(view));
fs.writeFileSync('build/marker-fix-2026-09-02/APPLIED.json', JSON.stringify({cid:CID, from:FROM, to:TO, checks, view, at:new Date().toISOString()},null,1));
console.log(Object.values(checks).every(Boolean) && view.expectedCls?.includes('fr-view') ? '\nALL CHECKS PASSED' : '\nCHECK FAILED - see above');
await b.close();

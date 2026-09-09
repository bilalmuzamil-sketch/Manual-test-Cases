// Recon: build marker + an EDITABLE work order with a line + the Parts / Add Part route.
// Routes are WALKED in the UI (never guessed). API host is read from the harness, not assumed.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page, APP, APIH } = s;
const out = { identity:{templateSlug:s.templateSlug,nFePerms:s.nFePerms,role:s.role}, APP, APIH };
out.buildMarker = await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content ?? null);
log('build marker:', out.buildMarker, '| APIH:', APIH);

// --- read the work-order list from the API HOST (a READ, to pick a record - Rule 14)
const wos = await page.evaluate(async (apih) => {
  const r = await fetch(`https://${apih}/api/work-orders?limit=60`, {credentials:'include', headers:{Accept:'application/json'}});
  if (!r.ok) return {err:'HTTP '+r.status};
  const j = await r.json();
  const rows = j.data ?? j.items ?? j.results ?? j;
  return (Array.isArray(rows)?rows:[]).map(w=>({ id:w.id, number:w.number ?? w.display_number ?? w.wo_number,
    status:(w.status&&(w.status.name??w.status))||w.state||null, editable:w.is_editable ?? w.editable ?? null }));
}, APIH);
out.workOrders = wos;
if (wos && wos.err) { log('work-orders read FAILED:', wos.err); }
const list = Array.isArray(wos)?wos:[];
const byStatus={}; for (const w of list) byStatus[String(w.status)]=(byStatus[String(w.status)]||0)+1;
log('work orders:', list.length, '| statuses:', JSON.stringify(byStatus));
const cand = list.filter(w=>!/complete|invoiced|paid|cancel/i.test(String(w.status||'')));
log('editable candidates:', cand.length);
out.candidates = cand.slice(0,12);

// --- walk into the first editable one and read the real structure
for (const w of cand.slice(0,4)) {
  await page.goto(`${APP}/workorders/${w.id}`, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(9000);
  const st = await page.evaluate(() => {
    const txt = e => (e.textContent||'').replace(/\s+/g,' ').trim();
    const btns=[...document.querySelectorAll('button,[role=button],a')].map(b=>({l:txt(b).slice(0,40),tid:b.getAttribute('data-test-id')})).filter(b=>b.l);
    return { addPart: btns.filter(b=>/add part/i.test(b.l)),
             addLine: btns.filter(b=>/add line|new line/i.test(b.l)).slice(0,3),
             hasPartsWord: /\bParts\b/.test(document.body.innerText||''),
             head:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,300) };
  });
  log(`WO ${w.number} (${w.status}) -> AddPart:${st.addPart.length} AddLine:${st.addLine.length} partsWord:${st.hasPartsWord}`);
  out['wo_'+w.number] = { ...w, ...st, url: page.url() };
  if (st.addPart.length) { out.chosen = { ...w, url: page.url() };
    await page.screenshot({path:`${DIR}/evidence/01-wo-${w.number}.png`, fullPage:true}); break; }
}
if (!out.chosen && cand.length) {
  // no Add Part visible on any: capture the first one fully so we can see why
  await page.screenshot({path:`${DIR}/evidence/01-no-addpart.png`, fullPage:true});
  out.noAddPartBody = await page.evaluate(()=> (document.body.innerText||'').replace(/\s+/g,' ').slice(0,1500));
  log('NO Add Part button on any candidate - body captured');
}
fs.writeFileSync(`${DIR}/evidence/01-recon.json`, JSON.stringify(out,null,1));
log('chosen:', JSON.stringify(out.chosen||null));
await s.browser.close();

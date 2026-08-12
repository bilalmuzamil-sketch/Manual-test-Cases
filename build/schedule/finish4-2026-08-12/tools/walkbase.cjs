// Shared walk helpers. Every probe writes its result file after EVERY case,
// so a killed run leaves its exact position on disk.
const fs = require('fs');
const V = `(e)=>{const r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return false;const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01;}`;

function mkRecorder(file) {
  const walk = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  return {
    walk,
    record(cid, steps, verdict) {
      walk[cid] = { steps, verdict, at: new Date().toISOString() };
      fs.writeFileSync(file, JSON.stringify(walk, null, 1));
      console.log(`== C${cid}: ${verdict}`);
      steps.forEach(s => console.log(`     ${s.step} -> ${String(s.seen).slice(0, 200)}`));
    }
  };
}
async function ev(page, fn, arg) { return page.evaluate(fn, Object.assign({ v: V }, arg || {})); }
// read visible popups (menus, dialogs, tooltips) as plain text
async function pops(page) {
  return ev(page, ({ v }) => { const vis = eval(v);
    return [...document.querySelectorAll('.q-menu,.q-dialog,[role="dialog"],[role="menu"],.q-tooltip')]
      .filter(vis).map(d => (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 900)); });
}
async function esc(page, n = 1) { for (let i = 0; i < n; i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(400); } }
async function range(page) { return ev(page, () => { const r = document.querySelector('[data-test-id="text_schedule_range"]'); return r ? (r.innerText || '').trim() : null; }); }
async function setView(page, name) {
  const ok = await ev(page, ({ name, v }) => { const vis = eval(v);
    const t = document.querySelector('[data-test-id="schedule_view_toggle"]'); if (!t) return false;
    const b = [...t.querySelectorAll('button,.q-btn,div,span')].filter(vis).find(e => (e.innerText || '').trim() === name);
    if (!b) return false; b.click(); return true; }, { name });
  await page.waitForTimeout(2800); return ok;
}
// click a data-test-id
async function clickId(page, id, idx = 0) {
  const ok = await ev(page, ({ id, idx, v }) => { const vis = eval(v);
    const els = [...document.querySelectorAll(`[data-test-id="${id}"]`)].filter(vis);
    if (!els[idx]) return false; els[idx].click(); return true; }, { id, idx });
  await page.waitForTimeout(1700); return ok;
}
// click a visible element by exact text
async function clickText(page, text, within) {
  const ok = await ev(page, ({ text, within, v }) => { const vis = eval(v);
    const root = within ? document.querySelector(within) : document;
    if (!root) return false;
    const b = [...root.querySelectorAll('button,.q-btn,.q-item,label,div,span,a')].filter(vis)
      .filter(e => (e.innerText || '').trim() === text)
      .sort((a, b2) => (a.innerText || '').length - (b2.innerText || '').length)[0];
    if (!b) return false; b.click(); return true; }, { text, within: within || null });
  await page.waitForTimeout(1700); return ok;
}
module.exports = { V, mkRecorder, ev, pops, esc, range, setView, clickId, clickText };

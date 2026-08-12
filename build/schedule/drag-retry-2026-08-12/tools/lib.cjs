// lib.cjs — shared page helpers for the drag re-try, 2026-08-12.
//
// READ THE COMPUTED STYLE, NOT JUST textContent.  These labels carry CSS
// text-transform, so textContent reads 'Approved - partially completed' while
// the tester sees 'Approved - Partially Completed'.  A sweep on textContent
// alone would have "corrected" five cases on a final report hours before
// release.  Every reader below returns {raw, transform, shown}.
const CAP = (s) => s.replace(/\b[a-z]/g, c => c.toUpperCase());
function shownFor(raw, tr) {
  if (tr === 'uppercase') return raw.toUpperCase();
  if (tr === 'lowercase') return raw.toLowerCase();
  if (tr === 'capitalize') return CAP(raw);
  return raw;
}
// Returns the LAST visible overlay. Quasar leaves earlier menus mounted, so
// reading the first one reports a stale menu as the live one.
const READ_OVERLAY = `(() => {
  const CAP = (s) => s.replace(/\\b[a-z]/g, c => c.toUpperCase());
  const shownFor = (raw, tr) => tr==='uppercase'?raw.toUpperCase():tr==='lowercase'?raw.toLowerCase():tr==='capitalize'?CAP(raw):raw;
  const open = Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
    .filter(e => { const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
                   return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0; });
  const s = open[open.length-1];
  if (!s) return { open: 0, nodes: [], ids: [], buttons: [] };
  const nodes=[]; const w=document.createTreeWalker(s,NodeFilter.SHOW_TEXT); let n;
  while((n=w.nextNode())){ const t=(n.nodeValue||'').trim(); if(!t) continue;
    const p=n.parentElement; if(!p) continue; const cs=getComputedStyle(p);
    if(cs.display==='none'||cs.visibility==='hidden') continue;
    nodes.push({ raw:t, transform:cs.textTransform, shown:shownFor(t,cs.textTransform) }); }
  const buttons = Array.from(s.querySelectorAll('button,[role=button],.q-btn,[role=checkbox],.q-checkbox,input'))
    .map(e => { const r=e.getBoundingClientRect(); const cs=getComputedStyle(e);
      return { tid:e.getAttribute('data-test-id'), tag:e.tagName, type:e.getAttribute('type'),
               raw:(e.innerText||e.value||'').trim().slice(0,60),
               shown:shownFor((e.innerText||e.value||'').trim().slice(0,60),cs.textTransform),
               disabled: e.disabled===true || e.getAttribute('aria-disabled')==='true' || /disabled/.test(e.className),
               x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2), w:Math.round(r.width), h:Math.round(r.height) }; })
      .filter(b => b.w>0);
  return { open: open.length, nodes, ids: Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id')), buttons };
})()`;
module.exports = { READ_OVERLAY, shownFor };

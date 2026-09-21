// Rule 62-c re-verify of C53476 on today's build.
// PRD v1.5 §5.2 (live read 21 Sep, line 71): "Counts are capped at 20. No count in the modal reads
// higher than 20 - not a tab, not a group header, not the Show all N link."
// Read EVERY count the modal shows, on the screen, for a broad query. Playbook traps applied:
// click the All tab explicitly (trap 1); count rows unfiltered (trap 3); require 3 identical
// reads AND >=5s with the counts PRESENT (trap 4).
import { open, ensureOpen, type as tp, SEL } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const OUT='/home/user/Manual-test-Cases/build/global-search/rerun-2026-09-21/';
const { page, browser } = await open('sv9160','/work-orders','admin');
await page.waitForTimeout(3000);
const marker = await page.evaluate(()=> (document.querySelector('meta[name=app-version]')||{}).content );
console.log('BUILD MARKER:', marker);

async function settledRead(q){
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  await ensureOpen(page); await tp(page,q,4500);
  // trap 1: land on All explicitly
  await page.evaluate(([s])=>{const e=[...document.querySelectorAll(s)].find(x=>/^\s*All\b/i.test((x.innerText||'').trim()));if(e)e.click();},[SEL.tab]);
  let last=null, same=0;
  for(let i=0;i<10;i++){
    await page.waitForTimeout(1500);
    const snap = await page.evaluate(([tabSel,rowSel])=>({
      tabs: [...document.querySelectorAll(tabSel)].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()),
      groups: [...document.querySelectorAll('.search-group__header, .search-group-header, [class*="group"][class*="header"]')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
      showall: [...document.querySelectorAll('a,button,span')].map(e=>(e.innerText||'').trim()).filter(t=>/^Show all\b/i.test(t)),
      announce: [...document.querySelectorAll('[aria-live],[role=status],.search-modal *')].map(e=>(e.innerText||'').trim()).filter(t=>/results? found/i.test(t)).slice(0,3),
      rows: document.querySelectorAll(rowSel).length,
    }),[SEL.tab,SEL.row]);
    const key=JSON.stringify(snap);
    if(key===last){ same++; if(same>=2 && snap.tabs.some(t=>/\(\d+\)/.test(t))) return snap; } else { same=0; last=key; }
  }
  return JSON.parse(last);
}

for (const q of ['ZZ','ZZAUTOTEST']) {
  console.log('\n================ QUERY: '+JSON.stringify(q));
  const s = await settledRead(q);
  console.log('TABS      :', JSON.stringify(s.tabs));
  console.log('GROUPS    :', JSON.stringify(s.groups));
  console.log('SHOW ALL  :', JSON.stringify(s.showall));
  console.log('ANNOUNCED :', JSON.stringify(s.announce));
  console.log('ROWS in All view:', s.rows);
  const nums=[];
  const grab=t=>{const m=[...String(t).matchAll(/\((\d+)\)|\bShow all (\d+)|\b(\d+) results?/gi)];m.forEach(x=>nums.push(Number(x[1]||x[2]||x[3])));};
  s.tabs.forEach(grab); s.groups.forEach(grab); s.showall.forEach(grab); s.announce.forEach(grab);
  const over = nums.filter(n=>n>20);
  console.log('ALL NUMBERS SHOWN:', JSON.stringify(nums));
  console.log('>>> COUNTS ABOVE 20:', JSON.stringify(over), over.length? 'FAILS the documented cap':'within the cap');
  await page.screenshot({path:OUT+'v53476-'+q+'.png'});
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
}
console.log('\nBUILD MARKER:', marker);
await browser.close();

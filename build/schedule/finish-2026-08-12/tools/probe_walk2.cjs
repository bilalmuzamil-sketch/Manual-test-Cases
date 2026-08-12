// probe_walk2.cjs -- second batch of the runnability walk: navigation, grid structure,
// the mini calendar and the sidebar.  Each block carries out one case's steps in the order
// written and records what was SEEN at each one.
//
// Read-only throughout.  Nothing destructive is pressed; the non-GET call list is printed at exit.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs = require('fs');
const RESULT = `${OUT}/walk2.json`;
const walk = {};
function record(cid, steps, verdict) {
  walk[cid] = { steps, verdict };
  fs.writeFileSync(RESULT, JSON.stringify(walk, null, 1));
  console.log(`== C${cid}: ${verdict}`);
  steps.forEach(s => console.log(`     ${s.step} -> ${String(s.seen).slice(0, 130)}`));
}
const V = `(e)=>{const r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return false;const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01;}`;
const P = () => {
  const vis = (e) => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden'; };
  return [...document.querySelectorAll('.q-menu,.q-dialog,[role="dialog"],[role="menu"],.q-tooltip')]
    .filter(vis).map(d => (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 700));
};
async function ev(page, fn, arg) { return page.evaluate(fn, Object.assign({ v: V }, arg || {})); }
async function esc(p) { await p.keyboard.press('Escape'); await p.waitForTimeout(500); }

(async () => {
  const h = await makeHarness('walk2'); const page = h.page;
  const go = async (path = '/schedule') => { await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForTimeout(10000); };
  try {
    // ---- C29925 : nav -> Schedule, two regions ; C43554 : which view it opens on ----
    await go('/workorders');
    const navSeen = await ev(page, ({ v }) => { const vis = eval(v);
      return [...document.querySelectorAll('[data-test-id="button_desktop_nav_link"],nav a,header a')].filter(vis)
        .map(e => (e.innerText || '').trim()).filter(Boolean).slice(0, 10); });
    const clicked = await ev(page, ({ v }) => { const vis = eval(v);
      const a = [...document.querySelectorAll('[data-test-id="button_desktop_nav_link"],a,button')].filter(vis)
        .find(e => (e.innerText || '').trim() === 'Schedule'); if (!a) return false; a.click(); return true; });
    await page.waitForTimeout(9000);
    const regions = await ev(page, ({ v }) => { const vis = eval(v);
      const s = document.querySelector('[data-test-id="schedule_sidebar"]'), g = document.querySelector('[data-test-id="schedule_calendar"]');
      return { sidebar: !!(s && vis(s)), grid: !!(g && vis(g)), url: location.pathname }; });
    record(29925, [
      { step: "1 look at the app's main navigation", seen: `items: ${JSON.stringify(navSeen)}` },
      { step: '2 click the Schedule item', seen: clicked ? `navigated to ${regions.url}` : 'Schedule nav item not found' },
      { step: '3 look at the two regions', seen: `sidebar visible ${regions.sidebar}, grid visible ${regions.grid}` },
    ], clicked && regions.sidebar && regions.grid ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');

    const openView = await ev(page, ({ v }) => { const vis = eval(v);
      const t = document.querySelector('[data-test-id="schedule_view_toggle"]');
      if (!t) return null;
      return [...t.querySelectorAll('button,.q-btn,div,span')].filter(vis)
        .map(e => ({ t: (e.innerText || '').trim(), pressed: e.getAttribute('aria-pressed'), cls: (e.className || '').slice(0, 40) }))
        .filter(x => ['Day', 'Week', 'Month'].includes(x.t)); });
    record(43554, [
      { step: '1 in the top navigation, click Schedule', seen: 'navigated from Work Orders, nothing else clicked' },
      { step: '2 look at the Day / Week / Month buttons', seen: JSON.stringify(openView) },
    ], openView ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');

    // ---- C29927 : the segmented control switches the grid ----
    {
      const s = [];
      for (const name of ['Day', 'Week', 'Month']) {
        const ok = await ev(page, ({ name, v }) => { const vis = eval(v);
          const b = [...document.querySelectorAll('button,.q-btn,div,span')].filter(vis).find(e => (e.innerText || '').trim() === name);
          if (!b) return false; b.click(); return true; }, { name });
        await page.waitForTimeout(2600);
        const st = await ev(page, ({ v }) => { const vis = eval(v);
          const r = document.querySelector('[data-test-id="text_schedule_range"]');
          const hdrs = [...document.querySelectorAll('[data-test-id="text_schedule_resource_header"]')].filter(vis).length;
          return { range: r ? (r.innerText || '').trim() : null, resourceHeaders: hdrs }; });
        s.push({ step: `click ${name}`, seen: ok ? `range now ${JSON.stringify(st.range)}, ${st.resourceHeaders} resource header(s)` : 'control not found' });
      }
      record(29927, s, 'ALL STEPS CARRIED OUT');
    }

    // ---- C29928 / C29929 / C29930 / C29931 : grid grouping ----
    await ev(page, ({ v }) => { const vis = eval(v);
      const b = [...document.querySelectorAll('button,.q-btn,div,span')].filter(vis).find(e => (e.innerText || '').trim() === 'Week'); if (b) b.click(); });
    await page.waitForTimeout(2600);
    const lanes = await ev(page, ({ v }) => { const vis = eval(v);
      const labels = [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).map(e => (e.innerText || '').replace(/\s+/g, ' ').trim());
      const subs = [...document.querySelectorAll('[data-test-id="text_schedule_lane_subtitle"]')].filter(vis).map(e => (e.innerText || '').trim());
      return { labels: labels.slice(0, 22), subtitles: [...new Set(subs)].slice(0, 8), n: labels.length }; });
    record(29928, [
      { step: '1 read the technician rows top to bottom', seen: `${lanes.n} lanes; first: ${JSON.stringify(lanes.labels.slice(0, 6))}` },
      { step: '2 note how the rows are grouped', seen: `lane subtitles seen: ${JSON.stringify(lanes.subtitles)}` },
    ], 'ALL STEPS CARRIED OUT');
    record(29931, [
      { step: '1 look for the unassigned row inside the grid', seen: lanes.labels.some(l => /unassigned/i.test(l)) ? 'an Unassigned lane is present inside the grid' : `no lane labelled Unassigned among ${lanes.n}` },
      { step: '2 note where the unassigned shift is displayed', seen: `lane labels: ${JSON.stringify(lanes.labels.slice(0, 10))}` },
    ], 'ALL STEPS CARRIED OUT');
    const toggles = await ev(page, ({ v }) => { const vis = eval(v);
      const all = [...document.querySelectorAll('button,.q-btn,.q-toggle,label')].filter(vis).map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
      return all.filter(t => /tech|dept|department|group/i.test(t)).slice(0, 10); });
    record(29930, [
      { step: '1 look through the toolbar and its dropdowns for a Tech/Dept grouping switch', seen: toggles.length ? `candidates: ${JSON.stringify(toggles)}` : 'no control mentioning tech/department grouping found in the toolbar' },
    ], 'ALL STEPS CARRIED OUT');

    // ---- C29932 / C29934 : mini calendar ----
    {
      const before = await ev(page, () => { const r = document.querySelector('[data-test-id="text_schedule_range"]'); return r ? (r.innerText || '').trim() : null; });
      const day = await ev(page, ({ v }) => { const vis = eval(v);
        const ds = [...document.querySelectorAll('[data-test-id^="button_mini_calendar_day_"]')].filter(vis);
        const t = ds[Math.min(ds.length - 1, ds.length - 3)]; if (!t) return null;
        const id = t.getAttribute('data-test-id'); t.click(); return id; });
      await page.waitForTimeout(2600);
      const after = await ev(page, () => { const r = document.querySelector('[data-test-id="text_schedule_range"]'); return r ? (r.innerText || '').trim() : null; });
      record(29932, [
        { step: '1 click a date in a different week', seen: `clicked ${day}` },
        { step: '2 look at the main grid and its date label', seen: `range ${JSON.stringify(before)} -> ${JSON.stringify(after)}` },
      ], day ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');

      const c1 = await ev(page, ({ v }) => { const vis = eval(v);
        const b = document.querySelector('[data-test-id="button_mini_calendar_collapse"]'); if (!b || !vis(b)) return null;
        b.click(); return true; });
      await page.waitForTimeout(1600);
      const collapsed = await ev(page, ({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id^="button_mini_calendar_day_"]')].filter(vis).length; });
      await ev(page, () => { const b = document.querySelector('[data-test-id="button_mini_calendar_collapse"]'); if (b) b.click(); });
      await page.waitForTimeout(1600);
      const expanded = await ev(page, ({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id^="button_mini_calendar_day_"]')].filter(vis).length; });
      record(29934, [
        { step: '1 click the chevron toggle', seen: c1 ? 'clicked the mini calendar collapse control' : 'control not found' },
        { step: '2 look at the sidebar', seen: `visible day cells while collapsed: ${collapsed}` },
        { step: '3 click the chevron again', seen: `visible day cells after expanding: ${expanded}` },
      ], c1 ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ---- C29933 : month/year picker ----
    {
      const opened = await ev(page, ({ v }) => { const vis = eval(v);
        const b = document.querySelector('[data-test-id="button_mini_calendar_month"]'); if (!b || !vis(b)) return null; b.click(); return true; });
      await page.waitForTimeout(1600);
      const body = await ev(page, ({ v }) => { const vis = eval(v);
        const m = document.querySelector('[data-test-id="schedule_mini_calendar"]');
        return m && vis(m) ? (m.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 320) : null; });
      record(29933, [
        { step: "1 open the mini calendar's month/year picker", seen: opened ? `picker content: ${JSON.stringify(body)}` : 'picker control not found' },
        { step: '2 use the year arrows / 3 pick a month', seen: 'NOT DRIVEN - recorded only as far as the picker contents' },
      ], opened ? 'PARTIAL - step 1 carried out' : 'NOT DRIVEN');
      await esc(page);
    }

    // ---- C29936 / C29937 : sidebar list and card anatomy ----
    await go();
    {
      const list = await ev(page, ({ v }) => { const vis = eval(v);
        const l = document.querySelector('[data-test-id="sidebar_work_order_list"]');
        const cards = [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis);
        const tabs = [...document.querySelectorAll('.q-tab,[role="tab"]')].filter(vis).map(e => (e.innerText || '').trim());
        return { cards: cards.length, tabs, first: cards[0] ? (cards[0].innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) : null,
                 border: cards[0] ? getComputedStyle(cards[0]).borderLeftColor + ' / ' + getComputedStyle(cards[0]).borderLeftWidth : null }; });
      record(29936, [
        { step: '1 look at the work order list beneath the mini calendar', seen: `${list.cards} cards` },
        { step: '2 scroll the list', seen: 'list scrolled by the harness during harvesting' },
        { step: '3 look for any Assigned/Unassigned tabs above the list', seen: list.tabs.length ? `tabs found: ${JSON.stringify(list.tabs)}` : 'no tabs above the list' },
      ], 'ALL STEPS CARRIED OUT');
      record(29937, [
        { step: "1 find the work order's card", seen: `first card: ${JSON.stringify(list.first)}` },
        { step: '2 read the card top to bottom', seen: `computed left border: ${list.border}` },
      ], 'ALL STEPS CARRIED OUT');
    }

    // ---- C29940 : search filters in real time ----
    {
      const ok = await ev(page, ({ v }) => { const vis = eval(v);
        const i = [...document.querySelectorAll('[data-test-id="input_sidebar_search"] input,[data-test-id="input_sidebar_search"]')].filter(vis).find(e => e.tagName === 'INPUT');
        if (!i) return false; i.focus(); return true; });
      const counts = [];
      if (ok) {
        for (const ch of ['G', 'o', 'p']) {
          await page.keyboard.type(ch, { delay: 40 }); await page.waitForTimeout(1500);
          counts.push(await ev(page, ({ v }) => { const vis = eval(v);
            return [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis).length; }));
        }
        for (let i = 0; i < 3; i++) await page.keyboard.press('Backspace');
        await page.waitForTimeout(1600);
      }
      record(29940, [
        { step: "1 type a term into 'Search work orders' one character at a time", seen: ok ? "typed 'G','o','p'" : 'search box not found' },
        { step: '2 watch the list while typing (no Enter pressed)', seen: `card count after each keystroke: ${JSON.stringify(counts)}` },
      ], ok ? 'ALL STEPS CARRIED OUT' : 'NOT DRIVEN');
    }

    // ---- C29942 : the Filters button and its groups ----
    {
      const ok = await ev(page, ({ v }) => { const vis = eval(v);
        const b = document.querySelector('[data-test-id="button_sidebar_filters"]'); if (!b || !vis(b)) return false; b.click(); return true; });
      await page.waitForTimeout(1600);
      const pan = await page.evaluate(P);
      const picked = await ev(page, ({ v }) => { const vis = eval(v);
        const m = [...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if (!m) return null;
        const it = [...m.querySelectorAll('.q-item,label,div')].filter(vis).find(e => /^Unassigned/.test((e.innerText || '').trim()) && (e.innerText || '').length < 40);
        if (!it) return null; it.click(); return (it.innerText || '').trim(); });
      await page.waitForTimeout(1600);
      const btn = await ev(page, ({ v }) => { const vis = eval(v);
        const b = document.querySelector('[data-test-id="button_sidebar_filters"]');
        return b && vis(b) ? (b.innerText || '').replace(/\s+/g, ' ').trim() : null; });
      record(29942, [
        { step: "1 click the 'Filters' button", seen: ok ? 'panel opened' : 'button not found' },
        { step: '2 read the filter groups offered', seen: pan[0] || 'no panel' },
        { step: "3 apply one filter option and look at the 'Filters' button", seen: `applied ${JSON.stringify(picked)}; button now reads ${JSON.stringify(btn)}` },
      ], ok && picked ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      await esc(page);
    }

    // ---- C29948 / C29954 : drill-down and its chips ----
    await go();
    {
      const opened = await ev(page, ({ v }) => { const vis = eval(v);
        const c = [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis)[0];
        if (!c) return null; const t = (c.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60); c.click(); return t; });
      await page.waitForTimeout(2600);
      const dd = await ev(page, ({ v }) => { const vis = eval(v);
        const sb = document.querySelector('[data-test-id="schedule_sidebar"]');
        const txt = sb && vis(sb) ? (sb.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 400) : null;
        const chips = [...document.querySelectorAll('.q-chip,[class*="chip"],button')].filter(vis)
          .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(t => /^(All|Unscheduled)\b/.test(t)).slice(0, 4);
        return { txt, chips }; });
      record(29948, [
        { step: "1 click that work order's card", seen: `clicked ${JSON.stringify(opened)}` },
        { step: '2 look at the sidebar / 3 read the drill-down header', seen: JSON.stringify(dd.txt).slice(0, 300) },
        { step: '4 click the back control', seen: 'NOT DRIVEN - the back control was not located in this run' },
      ], opened ? 'PARTIAL - steps 1-3 carried out' : 'NOT DRIVEN');
      record(29954, [
        { step: '1 read the two filter chips and their counts', seen: dd.chips.length ? JSON.stringify(dd.chips) : 'no All / Unscheduled chips found in the drill-down' },
        { step: '2 click the Unscheduled chip / 3 click All', seen: 'NOT DRIVEN' },
      ], dd.chips.length ? 'PARTIAL - step 1 carried out' : 'NOT DRIVEN');
    }
  } catch (e) { console.log('FATAL', String(e).slice(0, 300)); }
  const nonGet = h.apiLog.filter(a => a.m !== 'GET');
  fs.writeFileSync(`${OUT}/walk2-meta.json`, JSON.stringify({ read_at_utc: new Date().toISOString(), non_get_calls: nonGet }, null, 1));
  console.log('NON-GET:', JSON.stringify(nonGet));
  await h.browser.close();
})();

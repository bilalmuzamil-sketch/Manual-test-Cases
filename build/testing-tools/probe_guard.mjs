// probe_guard.mjs — STOP A PROBE FROM INVENTING A BLOCKER.
//
// WHY THIS EXISTS. On 2026-09-10 five "findings" in one session were not findings at all. Every one
// was MY OWN automation failing, reported as the product being broken:
//   * lines were searched for inside `.q-expansion-item` — lines are TABLE ROWS, so "no Add Part on
//     this line" was true of my selector, not the page
//   * the LAST three-dots button was taken as the toolbar menu — it is a LINE's menu, so "Print is
//     missing on four statuses" was my selector again
//   * a menu that never opened was recorded as "the item is absent"
//   * "Receive" was called broken because no dialog appeared — it NAVIGATES to a receive page, and I
//     described the page five seconds into that navigation, before it rendered
//   * a role was driven through a script; the script failed, so I reported that roles cannot be saved
//     — they save perfectly well through the screen
//
// THE COMMON SHAPE: **a NEGATIVE observation (absent / nothing / broken / impossible) produced by my
// own locator, timing or route.** A negative is only ever trustworthy when the same run PROVES the
// instrument works. That is what this file enforces, at observation time, so an unattended run traps
// itself instead of trapping the reader.
//
// USE:
//   import { settle, afterAction, assertNegative, GuardError } from './probe_guard.mjs';

export class GuardError extends Error {}

const VIS_FN = `(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;

/**
 * Wait until the page has actually stopped changing, instead of guessing a number.
 * Returns what it waited for, so the record shows the wait really happened.
 */
export async function settle(page, {maxMs=45000, quietMs=2500, label=''}={}) {
  const t0 = Date.now();
  let lastUrl = page.url(), lastLen = -1, quietSince = null, samples = 0;
  while (Date.now() - t0 < maxMs) {
    await page.waitForTimeout(700);
    samples++;
    let url = page.url(), len = 0;
    try { len = await page.evaluate(() => document.body ? document.body.innerHTML.length : 0); }
    catch (e) { continue; }                       // mid-navigation; keep waiting
    if (url === lastUrl && Math.abs(len - lastLen) < 40) {
      quietSince = quietSince ?? Date.now();
      if (Date.now() - quietSince >= quietMs)
        return {settled:true, ms:Date.now()-t0, samples, url, domLength:len, label};
    } else { quietSince = null; }
    lastUrl = url; lastLen = len;
  }
  return {settled:false, ms:Date.now()-t0, samples, url:page.url(), label,
          note:'the page never went quiet — treat any observation from here as UNRELIABLE'};
}

/**
 * Do something and record EVERYTHING it could have caused. A click can never be reported as
 * "nothing happened" unless all of these are empty — navigation, new tab, dialog, DOM growth,
 * and a write request are each checked.
 */
export async function afterAction(page, ctx, action, {label='action', maxMs=45000}={}) {
  const before = {
    url: page.url(),
    tabs: ctx ? ctx.pages().length : 1,
    domLength: await page.evaluate(() => document.body.innerHTML.length).catch(() => 0),
  };
  const writes = [];
  const onReq = r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url()))
    writes.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/, '').split('?')[0]}`); };
  page.on('request', onReq);

  const result = await action();
  const settled = await settle(page, {maxMs, label});
  page.off('request', onReq);

  const after = {
    url: page.url(),
    tabs: ctx ? ctx.pages().length : 1,
    domLength: await page.evaluate(() => document.body.innerHTML.length).catch(() => 0),
  };
  const panels = await page.evaluate(vis => { const isVis = eval(vis);
    const t = e => (e.textContent || '').replace(/\s+/g, ' ').trim();
    return [...document.querySelectorAll('.q-dialog,.q-drawer,.q-menu,[role=dialog]')]
      .filter(isVis).map(p => t(p).slice(0, 200));
  }, VIS_FN).catch(() => []);

  const effects = {
    navigated: before.url !== after.url,
    newTab: after.tabs > before.tabs,
    panelOpened: panels.length > 0,
    domChanged: Math.abs(after.domLength - before.domLength) > 200,
    wroteToServer: writes.length > 0,
  };
  const nothingHappened = !Object.values(effects).some(Boolean);
  return {label, result, before, after, settled, panels, writes, effects, nothingHappened,
    // the line a report should quote rather than the word "nothing"
    summary: nothingHappened
      ? 'no navigation, no new tab, no panel, no DOM change and no server write — a real no-op'
      : `effects: ${Object.entries(effects).filter(([,v])=>v).map(([k])=>k).join(', ')}`
      + (effects.navigated ? ` -> ${after.url}` : '')};
}

/**
 * THE GATE. Record a negative ("X is absent / cannot be done") ONLY if the same run proved the
 * instrument works. `positiveControls` are things the SAME locator/method DID find, in this run.
 * Throws unless at least one control passed, so an unattended probe stops instead of lying.
 */
export function assertNegative({what, method, positiveControls = [], attempts = 1,
                                settledRecord = null, userPathTried = null, allowUnproven = false}) {
  const problems = [];
  const passedControls = positiveControls.filter(c => c && c.passed);
  if (!passedControls.length)
    problems.push(`no positive control passed — nothing in this run shows that "${method}" can find `
      + `this kind of thing at all, so "${what} is absent" may just be a broken locator`);
  if (attempts < 2)
    problems.push(`only ${attempts} attempt — a negative needs at least 2, because a panel that never `
      + `opened and a panel with nothing in it look identical`);
  if (settledRecord && settledRecord.settled === false)
    problems.push('the page never went quiet before the observation was taken');
  if (userPathTried === false)
    problems.push('this was only attempted from behind the screen — a claim about the PRODUCT must be '
      + 'reproduced the way a user does it, through the UI');
  if (problems.length && !allowUnproven)
    throw new GuardError(`REFUSING TO RECORD "${what}" AS ABSENT/BLOCKED:\n  - ` + problems.join('\n  - ')
      + `\n  Fix the probe, or pass allowUnproven:true with a written reason.`);
  return {what, method, attempts, controlsPassed: passedControls.map(c => c.name),
    proven: !problems.length, problems};
}

/** Convenience: build a positive control record. */
export const control = (name, passed, detail = null) => ({name, passed: !!passed, detail});

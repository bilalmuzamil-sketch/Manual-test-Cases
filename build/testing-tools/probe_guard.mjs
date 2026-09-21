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

/**
 * 🛑 assertBehaviour — THE GATE FOR A POSITIVE CLAIM ABOUT HOW THE PRODUCT BEHAVES.
 *
 * `assertNegative` only fires on "X is absent/blocked". The five wrong calls of 2026-09-20/21
 * (SV-10277, SV-10279, SV-10188, SV-10211, SV-10278) were NOT absence claims — they were claims
 * about ORDERING and BEHAVIOUR, read off a machine-readable proxy: a capped score number, an
 * internal match label, a direct service call that could not carry page context, a fixture whose
 * other signals differed, and a stored permission list. Nothing stopped any of them. This does.
 *
 * Call it before a behaviour/ordering finding goes into a Jira ticket, a Failed result, or a
 * message to the QA lead. Skill: build/skills/19-HOW-NOT-TO-TEST.md.
 *
 * @param {string}   what            the claim, in behaviour terms a person would recognise
 * @param {string}   sourceQuote     the source's own sentence, verbatim, read live this pass
 * @param {string}   sourceRef       document + version + section + date read
 * @param {boolean}  observedOnScreen  read off the rendered UI, through the control a user uses
 * @param {string[]} confoundersHeldEqual  every other signal the source lists, held equal by a BUILT fixture
 * @param {number}   alternatingRounds  full A/B/A/B rounds that agreed (>= 2)
 * @param {boolean}  discriminating  could the fixture have shown the opposite result?
 * @param {object[]} positiveControls  control() records — the instrument can see this kind of thing
 * @param {string}   buildMarker     meta[name=app-version] read in this same run
 * @param {string}   myFaultRuledOut answer to "what would make this MY fault, and how did I rule it out?"
 */
export function assertBehaviour({what, sourceQuote = '', sourceRef = '', observedOnScreen = false,
                                 confoundersHeldEqual = [], alternatingRounds = 0,
                                 discriminating = null, positiveControls = [], buildMarker = '',
                                 myFaultRuledOut = '', allowUnproven = false}) {
  const problems = [];
  if (!sourceQuote.trim() || !sourceRef.trim())
    problems.push('no verbatim source sentence with its document, version, section and read date — '
      + 'a claim with no source is an opinion about the build (Rules 57, 106, 114)');
  if (!observedOnScreen)
    problems.push('not observed on the SCREEN through the control a person uses — a direct service '
      + 'call does not carry page context, and a response field is not behaviour (L0178, L0179, L0180)');
  if (!confoundersHeldEqual.length)
    problems.push('no confounders named as held equal — list every other signal the source gives and '
      + 'BUILD a fixture that holds them equal; found data differs in ways you have not enumerated (L0174)');
  if (alternatingRounds < 2)
    problems.push(`only ${alternatingRounds} agreeing round(s) — take the observation at least twice, `
      + 'alternating the conditions (A, B, A, B), and require both rounds to agree');
  if (discriminating === false)
    problems.push('the fixture was NOT discriminating — the record that should move was already at the '
      + 'extreme, so the run proves nothing either way and must be labelled inconclusive, not negative');
  if (discriminating === null)
    problems.push('discriminating power not stated — say explicitly whether this fixture COULD have '
      + 'shown the opposite result');
  if (!positiveControls.filter(c => c && c.passed).length)
    problems.push('no positive control passed — nothing shows the instrument can observe this kind of '
      + 'thing at all (for a context rule: does the output EVER differ between the two states?)');
  if (!buildMarker.trim())
    problems.push('no build marker recorded in this run — "the product changed" and "my method changed" '
      + 'are only separable when the marker is written down both times');
  if (!myFaultRuledOut.trim())
    problems.push('the seventh proof is unanswered: "what would make this MY fault, and how did I rule '
      + 'it out?" (Rule 104) — on SV-10188 the honest answer existed and the question was never asked');
  if (problems.length && !allowUnproven)
    throw new GuardError(`REFUSING TO RECORD THE BEHAVIOUR CLAIM "${what}":\n  - ` + problems.join('\n  - ')
      + '\n  Fix the measurement, not the wording. See build/skills/19-HOW-NOT-TO-TEST.md.');
  return {what, sourceRef, buildMarker, alternatingRounds, discriminating,
          controlsPassed: positiveControls.filter(c => c && c.passed).map(c => c.name),
          proven: !problems.length, problems};
}

/**
 * A page-dependent requirement ("if the user is currently on a Work Order …") CANNOT be measured by
 * a direct service call: the page context is attached by the front end, not by the URL. Throws when
 * a probe is about to do exactly that. Cost: two days of a wrong finding on SV-10188 (L0180).
 */
export function assertContextRuleMethod({requirementText = '', method = ''}) {
  const contextual = new RegExp([
    'if (?:the )?user is (?:currently )?on',   // "If the user is currently on a Customer page"
    'if on an? ',                              // "if on a Work Order, parts already on that WO..."
    'when (?:the )?user is on',
    'currently on an? ',
    'page context', 'in the context of', 'depending on where', 'from that (?:page|screen|record)',
    'while (?:standing |viewing )?on an? ',
  ].join('|'), 'i');
  if (contextual.test(requirementText) && /\b(api|fetch|endpoint|service call|direct call)\b/i.test(method))
    throw new GuardError(
      'THIS REQUIREMENT DEPENDS ON WHERE THE USER IS STANDING, AND THIS METHOD CANNOT CARRY THAT.\n'
      + `  requirement: "${requirementText.slice(0, 160)}"\n  method: "${method}"\n`
      + '  The page context is attached by the on-screen control, not by the URL or the cookie, so the\n'
      + '  two readings will be identical BY CONSTRUCTION and the rule will look unimplemented.\n'
      + '  Drive it through the screen. See build/skills/19-HOW-NOT-TO-TEST.md §2.2 and L0180.');
  return true;
}

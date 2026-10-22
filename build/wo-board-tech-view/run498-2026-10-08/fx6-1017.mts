/**
 * fx6-1017.mts — 17 Oct 2026: helpers for the SECOND fix-up round of run 498 (fixup-1017.txt, lines marked "fix-up 2").
 * New file only: session.mts, wob.mts, data.mts and fixup-1017.mts are unchanged (scripts still queued in the main run use them).
 *
 * openRetry()   — C581895 (c581895-v2.mts) could not sign in twice in the 16 Oct full run while ensure-heavy.mts signed in just
 *                 before and after it (L0413). The quick-login's first click left the page on /login, and the boot harness's
 *                 attempts 2-3 clear ALL cookies (the Google sign-in cookie too) so they can only land on Google's page; then it
 *                 calls process.exit(2). openRetry() turns that exit into an error, waits, and opens a FRESH browser (the
 *                 cookie files are read again), up to 3 times, logging every try ("SIGN-IN …"). One sign-in = one session
 *                 (L0394), so nothing else may sign in while it retries — the queue runs one step at a time.
 * techList() / pickTech() — the technician pick lists on the work order page (Lead Technician, Edit labor > Technician)
 *                 stop at about 100 names, the Q names (KNOWN PRODUCT FAULT SV-11393, L0396): Ralph Edwards is never drawn.
 *                 techList() reads EVERY drawn option (scrolling the list top to bottom) and logs count / first / last and
 *                 whether each wanted name is offered ("LIST …"). pickTech() then picks the first wanted name that IS offered
 *                 (the cases say "Names are examples", Rule 117), or picks nothing when the case needs one exact name
 *                 (`exact: true`, C368171), so the judge can mark it against SV-11393 with the list as evidence.
 *                 Positive control (Rule 104): a "not offered" reading counts only when the same reading drew >= 10 names
 *                 and found the current lead / a known early name in it.
 */
import type { Page } from 'playwright';
import { listAllOptions } from './wob.mts';

const t = () => new Date().toISOString().slice(11, 19);
export const optText = (x: string) => String(x ?? '').replace(/\s+/g, ' ').replace(/^(check_box_outline_blank|check_box|check|done)\s+/i, '').replace(/\s+(check|done)$/i, '').trim();

/** open() from session.mts, retried with a fresh browser when the boot harness gives up (it calls process.exit(2)) */
export async function openRetry<T>(open: (route: string) => Promise<T>, route: string, tries = 3): Promise<T> {
  const realExit = process.exit;
  for (let i = 1; i <= tries; i++) {
    (process as any).exit = ((c?: number) => { throw new Error(`sign-in harness exit ${c}`); }) as any;
    try { const r = await open(route); process.exit = realExit; console.log(t(), 'SIGN-IN OK on try', i); return r; }
    catch (e: any) {
      process.exit = realExit; console.log(t(), `SIGN-IN try ${i} of ${tries} failed: ${String(e?.message || e).slice(0, 160)}`);
      if (i === tries) { console.log(t(), 'SIGN-IN FAILED after', tries, 'fresh browsers — the case is NOT judged (a script fault, not a product finding)'); process.exit(2); }
      await new Promise((r) => setTimeout(r, 45_000 * i));   // 45 s, then 90 s: give the app's session time to settle before a new browser
    }
  }
  throw new Error('unreachable');
}

/** every option of the pick list that `opener` opens, in list order (scrolled top to bottom), then the list is closed */
export async function techList(pg: Page, opener: () => Promise<void>, label: string, wanted: string[] = [], control: string[] = []) {
  await opener(); await pg.waitForTimeout(1200);
  const names = [...new Set((await listAllOptions(pg)).map(optText).filter(Boolean))];
  const o: any = { label, count: names.length, first: names[0] ?? null, last: names[names.length - 1] ?? null, offered: {} as Record<string, boolean>, control: {} as Record<string, boolean>, names };
  for (const n of wanted) o.offered[n] = names.includes(n);
  for (const n of control) o.control[n] = names.includes(n);
  o.readingValid = names.length >= 10 && (!control.length || control.some((n) => names.includes(n)));
  console.log(t(), 'LIST', label, JSON.stringify({ count: o.count, first: o.first, last: o.last, offered: o.offered, control: o.control, readingValid: o.readingValid }));
  return o;
}

/** scroll the open list from the top until the option whose text IS `name` is drawn, then click it */
export async function clickOption(pg: Page, name: string) {
  await pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const s = m && ([m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4) || m); if (s) s.scrollTop = 0; })()`).catch(() => {});
  await pg.waitForTimeout(400);
  for (let i = 0; i < 150; i++) {
    const hit = await pg.evaluate(`(() => { document.querySelectorAll('[data-zz-pick]').forEach(e => e.removeAttribute('data-zz-pick'));
      const clean = (x) => String(x || '').replace(/\\s+/g, ' ').replace(/^(check_box_outline_blank|check_box|check|done)\\s+/i, '').replace(/\\s+(check|done)$/i, '').trim();
      const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return false;
      const it = [...m.querySelectorAll('.q-item')].find(e => clean(e.innerText) === ${JSON.stringify(name)}); if (!it) return false; it.setAttribute('data-zz-pick', '1'); return true; })()`).catch(() => false);
    // 22 Oct 2026 (production, C368166): the option was found but Playwright's click waited 30 s (the option sat outside the menu's
    // visible scroll area); a short real click first, then the option's own click() in the page — the same event the app listens for.
    if (hit) { const el = pg.locator('[data-zz-pick="1"]').first(); await el.scrollIntoViewIfNeeded().catch(() => {});
      const ok = await el.click({ timeout: 6000 }).then(() => true).catch(() => false);
      if (!ok) await pg.evaluate(`document.querySelector('[data-zz-pick="1"]')?.click()`);
      await pg.waitForTimeout(2000); return true; }
    const moved = await pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const s = m && ([m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4) || m); if (!s) return false; const b = s.scrollTop; s.scrollTop += 250; return s.scrollTop !== b; })()`).catch(() => false);
    await pg.waitForTimeout(250); if (!moved) break;
  }
  return false;
}

/** Open the list ONCE, log its names, then pick (in the same open list) the first of `prefer` that is offered and not in `avoid`.
 *  exact = true: only prefer[0] may be picked (the case quotes that name and says it must be used exactly). */
export async function pickTech(pg: Page, opener: () => Promise<void>, label: string, opts: { prefer: string[]; avoid?: string[]; control?: string[]; exact?: boolean }) {
  const avoid = opts.avoid ?? [];
  const list = await techList(pg, opener, label, opts.prefer, opts.control ?? []);
  const o: any = { list: { count: list.count, first: list.first, last: list.last, offered: list.offered, control: list.control, readingValid: list.readingValid, names: list.names }, wanted: opts.prefer[0], picked: null as string | null };
  const pool = opts.exact ? [opts.prefer[0]] : opts.prefer;
  const target = pool.find((n) => list.names.includes(n) && !avoid.includes(n)) ?? null;
  if (!target) {
    o.reason = opts.exact ? `"${opts.prefer[0]}" is not offered and the case needs that exact name` : `none of ${JSON.stringify(opts.prefer)} is offered`;
    if (opts.prefer[0] && !list.names.includes(opts.prefer[0])) o.knownFault = `SV-11393: the list drew ${list.count} names, "${list.first}" to "${list.last}"`;
    await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(600);
    console.log(t(), 'PICK', label, 'nothing picked:', o.reason); return o;
  }
  o.clicked = await clickOption(pg, target);
  o.picked = o.clicked ? target : null;
  if (target !== opts.prefer[0]) o.substitute = `"${opts.prefer[0]}" is not offered (SV-11393, list ends at "${list.last}"); the case's names are examples, so "${target}" was used`;
  console.log(t(), 'PICK', label, JSON.stringify({ wanted: opts.prefer[0], picked: o.picked, substitute: o.substitute ?? null }));
  return o;
}

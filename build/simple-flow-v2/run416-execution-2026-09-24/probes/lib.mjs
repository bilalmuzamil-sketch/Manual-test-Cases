// Shared helpers for the Simple Flow V2 run-416 execution probes (production, Trucks Hill 2).
// Boot once per script; never log in twice in the same script (a second login expires the first PHPSESSID).
import fs from 'fs';
export const EV = '/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
export const ORG_WORKPLACE = 'Trucks Hill 2';

export async function shot(page, name) {
  const p = `${EV}/${name}.png`;
  await page.screenshot({ path: p, fullPage: false });
  return p;
}
export async function text(page, name) {
  const t = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(`${EV}/${name}.txt`, t);
  return t;
}
export async function save(page, name) { await shot(page, name); return await text(page, name); }

// Records one observation for a case. Never a verdict - the verdict is judged against Expected afterwards.
export function record(caseId, key, value) {
  const f = `${EV}/observations.jsonl`;
  fs.appendFileSync(f, JSON.stringify({ at: new Date().toISOString(), case: caseId, key, value }) + '\n');
}

// Positive control (Rule 104): prove the instrument can SEE a thing before claiming a thing is absent.
export async function seesAnything(page, mustSee) {
  const t = await page.evaluate(() => document.body.innerText);
  return mustSee.every(s => t.includes(s));
}

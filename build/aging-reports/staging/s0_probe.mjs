// s0_probe.mjs — does the app render a report with the QA lead's cookies alone (no sign-in)? Header, URL, picture.
import { stgStart } from './stglib.mjs';
const s = await stgStart(new URL('./s0/', import.meta.url).pathname); await s.go('/reports/ar-aging-summary'); await s.page.waitForTimeout(4000);
const o = { url: s.page.url(), ls: await s.page.evaluate(() => Object.keys(localStorage)), where: s.where, hdr: (await s.page.locator('header').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(-60), h1: await s.page.locator('main h1, main .page-title').first().innerText().catch(() => null), blocked: s.blocked };
await s.shot('ars'); console.log(JSON.stringify(o)); await s.close(); process.exit(0);

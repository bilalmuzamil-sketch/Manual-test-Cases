// F3 shared boot: boot2 + the app's own localStorage 'location' AND 'timezone' keys (Rule 99 + F4's location trap), and a header
// assertion that the intended location is the one the app shows. SECRET-FREE.
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
export const LOC = { dvi: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test'], hd: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'], leth: ['f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton', 'Staging Lethbridge - 4310'] };
export async function f3boot(l) {
  const [WP, TZ, LNAME] = LOC[l];
  const r = await boot2('admin', { workplaceId: WP, timezone: TZ, contextOptions: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, timezoneId: TZ } });
  await r.page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [WP, TZ]);
  return { ...r, WP, TZ, LNAME };
}
// The location button in the top bar. Returns {ok, shown, ls_location}.
export async function assertLoc(page, LNAME, WP) {
  const shown = (await page.locator('header').innerText().catch(() => '')).replace(/\s+/g, ' ');
  const ls = await page.evaluate(() => localStorage.getItem('location'));
  return { ok: shown.includes(LNAME) && ls === JSON.stringify(WP), shown_has_name: shown.includes(LNAME), header: shown.slice(0, 400), ls_location: ls };
}

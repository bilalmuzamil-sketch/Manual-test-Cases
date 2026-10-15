/**
 * viewonly-pin-prod.mts — 15 Oct 2026 (wave 25 follow-up, QA lead's option 2 for C368208), EIGHTH pass. READ ONLY ON PRODUCTION.
 * C368208's Expected: "The toggle is shown disabled and does not change". On staging the view-only user's Asset on Site pin looks like
 * the ordinary pin and its tooltip reads "Asset not here. Click to toggle status." Rule 121: is production the same?
 * PRODUCTION (bootProdLogin, app.shopview.com) as the LOWER-PERMISSION login (/tmp/shopview/prod-login-limited.env,
 * bilal.muzamil+serviceadvisorlimitedview — recorded with Work orders View and no Work orders Create & Edit; its permissions are READ
 * LIVE here, because that login has drifted before): Work Orders > List > All, the first row's Asset on Site pin is hovered and
 * photographed, and its tooltip, disabled state (disabled / aria-disabled / class / cursor / opacity, on the pin and its button) are
 * recorded. The pin is CLICKED ONLY IF the page itself marks it disabled (then the row's on-site value is read before and after);
 * if it is not marked disabled, a click could change production data, so it is NOT clicked and the reading says so.
 * Nothing is saved, picked or changed. One sign-in. The whole script stops itself after 6 minutes.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { EV, t, shot } from './wob.mts';
// @ts-ignore
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';

const R: any = { production: {} };
const save = () => fs.writeFileSync(path.join(EV, 'viewonly-pin-prod.json'), JSON.stringify(R, null, 1));
const cap = <T,>(ms: number, pr: Promise<T>, fallback: any = 'timed out'): Promise<T> => Promise.race([pr, new Promise<T>((r) => setTimeout(() => r(fallback), ms))]);
const wd = setTimeout(() => { R.watchdog = 'stopped by the 6-minute limit'; try { save(); } catch { /* */ } process.exit(5); }, 6 * 60_000); wd.unref();

/** the pin's look and state, read off the page: the icon and the button around it */
const pinState = (pg: Page, row: string) => cap(20_000, pg.evaluate(`(() => { const tr = [...document.querySelectorAll('tbody tr')].find(r => r.innerText.includes(${JSON.stringify(row)})); if (!tr) return null;
  const b = tr.querySelector('[data-test-id="button_vehicle_here_toggle"]') || tr.querySelector('button:has(i)'); if (!b) return { button: 'none' };
  const i = b.querySelector('i'); const sb = getComputedStyle(b), si = i ? getComputedStyle(i) : null;
  return { testId: b.getAttribute('data-test-id'), tag: b.tagName, disabledProp: !!b.disabled, disabledAttr: b.hasAttribute('disabled'), ariaDisabled: b.getAttribute('aria-disabled'), tabindex: b.getAttribute('tabindex'),
    buttonClass: String(b.className).slice(0, 200), cursor: sb.cursor, opacity: sb.opacity, pointerEvents: sb.pointerEvents,
    icon: i ? i.innerText.trim() : null, iconClass: i ? String(i.className).slice(0, 120) : null, iconColor: si ? si.color : null, iconOpacity: si ? si.opacity : null }; })()`), 'timed out');
const tooltip = (pg: Page) => pg.locator('.q-tooltip').allInnerTexts().then((x) => x.map((y) => y.replace(/\s+/g, ' ').trim())).catch(() => [] as string[]);

{ const P = R.production; let prod: any = null;
  try { prod = await bootProdLogin('/workorders?tab=all', { envFile: process.env.PROD_LIMITED_ENVF || '/tmp/shopview/prod-login-limited.env', deviceScaleFactor: 2, viewport: { width: 1600, height: 1000 } });
    const p: Page = prod.page; p.setDefaultTimeout(30_000); P.build = prod.version ?? null; P.url = new URL(p.url()).pathname;
    const API = 'https://api.shopview.com';
    const get = (u: string) => cap(20_000, p.evaluate(async ([A, u2]) => { const r = await fetch(A + u2, { credentials: 'include', headers: { Accept: 'application/json' } }); let b = null; try { b = await r.json(); } catch { /* */ } return { status: r.status, body: b }; }, [API, u] as const), { status: 0, body: null } as any);
    // who this is and what they may do — read live (the login's role has drifted before)
    const fe = await get('/api/auth/me/fe-permissions'); const perms = ((fe.body?.data?.fe_permissions ?? []) as any[]).map((x) => typeof x === 'string' ? x : (x.key ?? x.name ?? x.slug ?? JSON.stringify(x).slice(0, 40)));
    P.permissionsCount = perms.length; P.workOrderPermissions = perms.filter((x) => /work.?order/i.test(x));
    P.viewOnlyWorkOrders = P.workOrderPermissions.some((x: string) => /view/i.test(x)) && !P.workOrderPermissions.some((x: string) => /create|edit/i.test(x) && !/line/i.test(x));
    P.topBar = (await p.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
    // Work Orders > List > All
    await p.goto('https://app.shopview.com/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
    const listBtn = p.locator('[aria-label="List"]').first(); if (await listBtn.count()) { await listBtn.click().catch(() => {}); await p.waitForTimeout(2500); }
    P.createButton = await p.getByRole('button', { name: /Create Work Order/i }).count();
    const row = await cap(15_000, p.evaluate(`(() => { const tr = [...document.querySelectorAll('tbody tr')].find(r => /[A-Z]+\\d*-\\d+/.test(r.innerText) && r.querySelector('[data-test-id="button_vehicle_here_toggle"], button i')); return tr ? tr.innerText.match(/[A-Z]+\\d*-\\d+/)[0] : null; })()`), null) as string | null;
    P.row = row; if (!row) { P.note = 'no List row with an Asset on Site pin found'; await shot(p, 'C368208-production-list'); }
    else {
      const pin = p.locator('tbody tr').filter({ hasText: row }).first().locator('[data-test-id="button_vehicle_here_toggle"]').first();
      P.pinFound = await pin.count(); P.state = await pinState(p, row);
      await pin.hover().catch(() => {}); await p.waitForTimeout(1500); P.tooltip = await tooltip(p); await shot(p, 'C368208-production-hover');
      const hereOf = async () => { const r = await get(`/api/work-orders?pagination[rowsPerPage]=20&search=${encodeURIComponent(row)}`); const w = ((r.body?.data?.work_orders ?? []) as any[]).find((x) => x.number === row); return w ? w.vehicleHere ?? w.is_vehicle_here ?? null : 'not found'; };
      const markedDisabled = P.state && typeof P.state === 'object' && (P.state.disabledProp || P.state.ariaDisabled === 'true' || /disabled/.test(P.state.buttonClass ?? ''));
      if (markedDisabled) { P.before = await hereOf(); await pin.click({ force: true }).catch(() => {}); await p.waitForTimeout(2500); P.tooltipAfterClick = await tooltip(p); await shot(p, 'C368208-production-after-click'); P.after = await hereOf(); P.changed = P.before !== P.after; }
      else { P.clicked = false; P.whyNotClicked = 'the page does not mark the pin disabled, so a click could change production data — read only, not clicked'; P.onSite = await hereOf(); }
    }
  } catch (e: any) { P.error = String(e?.message || e).slice(0, 300); }
  finally { save(); if (prod?.browser) await cap(20_000, prod.browser.close().catch(() => {}), undefined); } }

console.log(t(), 'VIEWONLYPIN', JSON.stringify(R).slice(0, 4000));
clearTimeout(wd); save(); process.exit(0);

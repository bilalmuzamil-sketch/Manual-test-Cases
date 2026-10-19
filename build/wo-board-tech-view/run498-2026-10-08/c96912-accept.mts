/** c96912-accept.mts — 19 Oct 2026, C96912 set-up: accept the yopmail invitation of a fresh test user (box from argv/env INBOX), set a password
 *  on the app's own page, then prove a REAL sign-in through the staging login form works for that user. The password is generated here and
 *  written ONLY to /tmp/qa-cookies/c96912-userb.json (chmod 600); nothing secret is printed. Cookie-free bridged browser (no Admin session).
 *  Output EV/c96912-accept.json, pictures EV/C96912-accept-*.png. */
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
import { chromium } from 'playwright';
const EV = process.env.WOB_EV || 'evidence'; const APP = process.env.GS_APP || 'https://app.staging.shopview.com';
const BOX = fs.readFileSync('/tmp/qa-cookies/c96912-box.txt', 'utf8').trim(); const EMAIL = `${BOX}@yopmail.com`;
const PW = 'Zz!' + crypto.randomBytes(9).toString('base64url') + '9a';
const SEC = '/tmp/qa-cookies/c96912-userb.json';
const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const b = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: `http://127.0.0.1:${PORT}` }, args: ['--no-sandbox', '--ignore-certificate-errors'] });
const ssoVal = (/sv_sso_session=([^;\s]+)/.exec(fs.readFileSync(process.env.WOB_SSO_FILE || '/tmp/qa-cookies/staging-sso.txt', 'utf8')) || [])[1];
const gate = (c: any) => c.addCookies(['app.staging.shopview.com', 'api.staging.shopview.com', 'auth.staging.shopview.com'].map((d) => ({ name: 'sv_sso_session', value: ssoVal, domain: d, path: '/', secure: true, sameSite: 'None' as const })));
const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } }); await gate(ctx); const pg = await ctx.newPage(); pg.setDefaultTimeout(20_000);
const o: any = { box: BOX }; const W = (ms: number) => pg.waitForTimeout(ms); const shot = (n: string) => pg.screenshot({ path: path.join(EV, `C96912-accept-${n}.png`) }).catch(() => {});
const strip = (u: string) => u.replace(/[0-9a-f]{16,}|[A-Za-z0-9_-]{30,}/g, '<token>');
try {
  await pg.goto(`https://yopmail.com/en/?login=${BOX}`, { waitUntil: 'domcontentloaded' }); await W(5000);
  const fm = pg.frame({ name: 'ifmail' }); if (!fm) throw new Error('no mail frame');
  const href: string = await fm.evaluate(`(() => { const a = [...document.querySelectorAll('a')].find(x => /Accept Invitation/i.test(x.innerText) || /confirm-invitation/.test(x.href)); return a ? a.href : null; })()`);
  if (!href) throw new Error('no Accept Invitation link'); o.link = strip(href);
  await pg.goto(href.replace(/^http:\/\//, 'https://'), { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(6000); o.landed = strip(pg.url()); await shot('1-landed');
  o.fields = await pg.evaluate(`[...document.querySelectorAll('input')].filter(e => e.getBoundingClientRect().width > 0).map(e => (e.type + ':' + (e.getAttribute('aria-label') || e.name || e.placeholder || e.closest('.q-field')?.querySelector('.q-field__label')?.innerText || '')).trim())`);
  o.pageText = (await pg.evaluate(`document.body.innerText`) as string).replace(/\s+/g, ' ').slice(0, 300);
  const pws = pg.locator('input[type=password]:visible'); o.passwordInputs = await pws.count();
  if (o.passwordInputs) { for (let i = 0; i < o.passwordInputs; i++) await pws.nth(i).fill(PW);
    fs.writeFileSync(SEC, JSON.stringify({ email: EMAIL, password: PW }), { mode: 0o600 });
    const sub = pg.locator('button[type=submit]:visible, button:visible').filter({ hasText: /^\s*(login|set|save|create|continue|confirm|submit|accept)\s*$/i }).first(); o.submitText = await sub.innerText().catch(() => null);
    await sub.click().catch(() => {}); await W(6000); o.afterSubmit = strip(pg.url()); o.afterText = (await pg.evaluate(`document.body.innerText`) as string).replace(/\s+/g, ' ').slice(0, 300); await shot('2-after-set'); }
  // prove a REAL sign-in with the login form in a fresh context
  const c2 = await b.newContext({ viewport: { width: 1400, height: 900 } }); await gate(c2); const p2 = await c2.newPage(); p2.setDefaultTimeout(20_000);
  await p2.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await p2.waitForTimeout(6000);
  o.loginInputs = await p2.evaluate(`[...document.querySelectorAll('input')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.type)`);
  o.loginButtons = await p2.evaluate(`[...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`);
  await p2.screenshot({ path: path.join(EV, 'C96912-accept-3-login.png') }).catch(() => {});
  const em = p2.locator('input[type=email]:visible, input[name=email]:visible, input[type=text]:visible').first();
  if (await em.count() && fs.existsSync(SEC)) { await em.fill(EMAIL); await p2.locator('button:visible').filter({ hasText: /^Next$/i }).first().click().catch(() => {}); await p2.waitForTimeout(4000); o.afterNext = { inputs: await p2.evaluate(`[...document.querySelectorAll('input')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.type)`), buttons: await p2.evaluate(`[...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`) }; await p2.locator('input[type=password]:visible').first().fill(PW);
    await p2.locator('button:visible').filter({ hasText: /^(sign in|log in|login|continue|next)$/i }).first().click().catch(() => {}); await p2.waitForTimeout(8000);
    o.signedIn = { url: strip(p2.url()), perms: await p2.evaluate(`fetch('https://api.staging.shopview.com/api/auth/me/fe-permissions', { credentials: 'include' }).then(r => r.status).catch(() => 0)`) };
    await p2.screenshot({ path: path.join(EV, 'C96912-accept-4-signed-in.png') }).catch(() => {}); }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 200); }
fs.writeFileSync(path.join(EV, 'c96912-accept.json'), JSON.stringify(o, null, 1)); console.log('ACCEPT', JSON.stringify(o)); await b.close(); process.exit(0);

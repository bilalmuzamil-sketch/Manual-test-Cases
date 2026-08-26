import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const { chromium } = pkg;
const variants = [
  ['no proxy option at all (env only)', {}],
  ['--proxy-server arg', {args:['--no-sandbox','--proxy-server=http://127.0.0.1:39423']}],
  ['headless_shell + proxy opt', {executablePath:'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', proxy:{server:'http://127.0.0.1:39423'}}],
];
for (const [name, extra] of variants) {
  let b;
  try {
    b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'], ...extra });
    const p = await b.newPage({ ignoreHTTPSErrors:true });
    const r = await p.goto('https://example.com/', {waitUntil:'domcontentloaded', timeout:30000});
    console.log('OK  ', name, r.status());
  } catch(e) { console.log('FAIL', name, '->', e.message.split('\n')[0].slice(0,140)); }
  finally { if (b) await b.close().catch(()=>{}); }
}

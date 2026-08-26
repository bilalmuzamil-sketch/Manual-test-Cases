// JOB 3 - settle the Group D rendering question by OBSERVATION (Rule 12).
// Logs into the TestRail UI and screenshots the CASE VIEW page (what a tester sees)
// for the three named Group D cases, plus the two cases Job 1 wrote.
// READ-ONLY in the UI: it opens view pages only, never an edit page, never Save.
import { chromium } from 'playwright';
import fs from 'fs';

const CREDS = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const CASES = process.argv.slice(2);
const OUT = '/tmp/rs/shots';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox'],
  proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:39423' },
});
const page = await browser.newPage({
  viewport: { width: 1400, height: 1100 },
  ignoreHTTPSErrors: true,
});

await page.goto('https://shopview.testrail.io/index.php?/auth/login/', { waitUntil: 'domcontentloaded' });
await page.fill('#name', CREDS.email);
await page.fill('#password', CREDS.password);
await page.click('#button_primary');
await page.waitForLoadState('networkidle');
console.log('LOGIN landed on:', page.url());

for (const cid of CASES) {
  await page.goto(`https://shopview.testrail.io/index.php?/cases/view/${cid}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const shot = `${OUT}/C${cid}-view.png`;
  await page.screenshot({ path: shot, fullPage: true });
  // Pull the rendered TEXT of the Steps/Preconditions/Expected blocks. If TestRail
  // renders the markup, the tag names will NOT appear in innerText; if it shows the
  // markup literally, "<ol>" / "<li>" WILL appear in innerText.
  const info = await page.evaluate(() => {
    const body = document.body.innerText;
    const tagsLiteral = ['<ol>', '<li>', '<p>', '<br>', '<hr>'].filter(t => body.includes(t));
    const counts = {
      ol: document.querySelectorAll('.content ol, #content ol').length,
      li: document.querySelectorAll('.content li, #content li').length,
    };
    return { title: document.title, tagsLiteral, counts, sample: body.slice(0, 0) };
  });
  console.log(JSON.stringify({ case: 'C' + cid, shot, ...info }));
}

await browser.close();

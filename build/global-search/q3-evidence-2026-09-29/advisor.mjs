import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/workorders/967fa148-b0f9-436b-b80a-562e995b9ed0/lines', { key:'admin', settle:13000 });
try {
  const s=await page.evaluate(()=>document.body.innerText.replace(/[ \t]+/g,' '));
  const g=l=>{const m=s.match(new RegExp(l+'\\s*\\n\\s*([^\\n]+)','i')); return m?m[1].trim():null;};
  console.log('Service Advisor on S2-34379:', JSON.stringify(g('Service Advisor')));
  console.log('Lead technician          :', JSON.stringify(g('Lead technician')));
} finally { await browser.close(); }

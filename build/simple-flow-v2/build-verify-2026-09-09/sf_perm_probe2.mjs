import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/settings','admin');
await page.waitForTimeout(8000);
console.log('URL:', page.url());
// dump ALL anchor hrefs + text and any element mentioning permission/role
const dump=await page.evaluate(()=>{
  const clean=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
  const anchors=[...document.querySelectorAll('a')].map(a=>({h:a.getAttribute('href'),t:clean(a)})).filter(x=>x.t&&x.t.length<50);
  const roleMentions=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/role|permission/i.test(e.textContent||'')).map(e=>clean(e)).filter((t,i,a)=>t&&t.length<50&&a.indexOf(t)===i).slice(0,30);
  return {anchors:anchors.slice(0,80), roleMentions};
});
console.log('ANCHORS:', JSON.stringify(dump.anchors));
console.log('ROLE MENTIONS:', JSON.stringify(dump.roleMentions));
await page.screenshot({path:OUT+'/settings-page-sv8683.png',fullPage:true}).catch(()=>{});
await browser.close();

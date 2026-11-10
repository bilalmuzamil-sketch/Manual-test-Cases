import {sess} from './common.mjs'; const s=await sess(); await s.go('/parts/vendors'); await s.page.waitForTimeout(3000);
const urls=[]; s.page.on('request',r=>{ if(r.url().includes('/api/')&&/vendor/i.test(r.url())) urls.push(r.method()+' '+r.url());});
await s.page.click('[data-test-id="page_search_toggle"]').catch(()=>{}); await s.page.keyboard.type('Akal'); await s.page.waitForTimeout(3000);
console.log(urls.join('\n')); const u=urls.filter(x=>x.includes('Akal')).pop(); if(u){ const r=await s.api(u.split(' ')[1].replace(s.host.api,'')); console.log(JSON.stringify(r.json).slice(0,900)); }
await s.browser.close();

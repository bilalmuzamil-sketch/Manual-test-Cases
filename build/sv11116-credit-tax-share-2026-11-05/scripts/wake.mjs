// usage: node wake.mjs -> opens the sleep URL in the browser, waits, then tries the app home; prints what it saw
import {sess} from './common.mjs'; const s=await sess({quick:null}).catch(e=>({err:e.message})); if(s.err){ console.log('ERR',s.err.slice(0,300)); process.exit(0);} const p=s.page;
await p.goto('https://sleep.qa.shopview.com/api/quick-login?api=sv11116').catch(e=>console.log('goto',e.message.slice(0,120)));
for(let i=0;i<12;i++){ await p.waitForTimeout(10000); const t=(await p.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,160); console.log(i,p.url().slice(0,100),t); if(!/sleep|waking|starting/i.test(p.url()+t)) break; }
await p.screenshot({path:'/tmp/sv11116/wake.png'}); await s.close(); process.exit(0);

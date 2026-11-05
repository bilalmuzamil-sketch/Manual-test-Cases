// usage: node wake.mjs <ticket> -> opens the branch login page in the browser (sleep page wakes the API), waits until quick-login works
import {sess} from './common.mjs'; const T=process.argv[2]; const s=await sess({dir:'/tmp/qa89'}).catch(e=>({err:e.message}));
if(s.err){ console.log('open err',s.err.slice(0,200)); process.exit(0); }
const p=s.page; await p.goto(`https://sleep.qa.shopview.com/api/quick-login?api=sv${T}`).catch(e=>console.log('goto',e.message.slice(0,100))); await p.waitForTimeout(5000);
console.log('url',p.url(),'text',(await p.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300)); await p.screenshot({path:`/tmp/wake-${T}.png`}); await s.close(); process.exit(0);

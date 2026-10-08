import {ob,j} from './lib.mjs';
const s=await ob({vp:{width:1600,height:1100}}); const p=s.page; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&/book|quick|qb|product|mapping/i.test(u.pathname)) log.push(r.request().method()+' '+r.status()+' '+u.pathname+u.search.slice(0,60)+' :: '+(await r.text()).slice(0,300));}catch(e){}});
await s.go('/administration/quickbooks'); await p.waitForTimeout(3500);
console.log((await p.evaluate(()=>document.querySelector('.q-page')?.innerText||document.body.innerText)).slice(0,2500));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-page [data-test-id]')].map(e=>e.getAttribute('data-test-id')).slice(0,80).join(' ')));
console.log(log.join('\n').slice(0,3000));
await p.screenshot({path:'/tmp/qa9226/qb-page.png',fullPage:true});
await s.close();

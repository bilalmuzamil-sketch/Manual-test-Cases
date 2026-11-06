import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const urls=[];
p.on('response',async r=>{ if(/deposit/i.test(r.url())&&r.request().method()==='GET') urls.push(r.url().replace(/^https:\/\/[^/]+/,'')+' => '+(await r.text().catch(()=>'')).slice(0,900)); });
await s.go('/customers/'+process.env.CID+'/deposits'); await p.waitForTimeout(6000); await p.screenshot({path:'../ev/'+process.env.ENV+'-deposits-tab.png'});
console.log(urls.join('\n')); console.log(await p.evaluate(()=>document.querySelector('main')?.innerText.replace(/\s+/g,' ').slice(0,900)));
await s.close(); process.exit(0);

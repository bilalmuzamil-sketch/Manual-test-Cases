import {open} from '../../testing-tools/qa-session.mjs';
const s=await open({env:'prod',ticket:'x',dir:'/tmp/qa25',user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const p=s.page; await s.go('/customers'); await p.waitForTimeout(6000);
console.log((await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,900))));
console.log(JSON.stringify(await s.marker())); await s.close(); process.exit(0);

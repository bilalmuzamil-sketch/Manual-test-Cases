import {ob,j} from './lib.mjs';
const s=await ob(); const p=s.page; const gets=[];
p.on('response',r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')) gets.push(r.request().method()+' '+r.status()+' '+u.pathname+u.search);}catch(e){}});
await s.go('/administration');
const links=await p.evaluate(()=>[...document.querySelectorAll('a')].map(a=>a.innerText.trim()+' => '+a.getAttribute('href')).filter(x=>/categor|part|pric|invent/i.test(x)));
console.log(links.join('\n'));
const href=(links.find(x=>/categor/i.test(x))||'').split(' => ')[1];
console.log('HREF',href); gets.length=0;
if(href){ await s.go(href); await p.waitForTimeout(2000); await p.screenshot({path:'/tmp/qa9138/cat-list.png',fullPage:false});
 console.log(gets.join('\n'));
 const rows=await p.evaluate(()=>[...document.querySelectorAll('tr,.q-item')].slice(0,15).map(e=>e.innerText.replace(/\s+/g,' ').trim()));
 console.log(rows.join('\n'));}
await s.close();

import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
const p=s.page; await s.go('/parts/part-sale/90a95f29-f405-4763-834d-6e3a237f8c33/part-requests'); await p.waitForTimeout(7000);
const out=await p.evaluate(()=>{ const t=document.querySelector('.base-table table')||document.querySelector('table.q-table'); const rows=[...t.querySelectorAll('tbody tr')].filter(r=>r.getBoundingClientRect().height>10);
  const pick=(r)=>[...r.querySelectorAll('td')].map(td=>td.outerHTML.replace(/\s+/g,' ').replace(/<svg.*?<\/svg>/g,'<svg/>').slice(0,700));
  return {r3:pick(rows[2]), r1:pick(rows[0]).slice(1,2)}; });
fs.writeFileSync('/tmp/qa11631/w/row.json',JSON.stringify(out,null,1)); process.exit(0);

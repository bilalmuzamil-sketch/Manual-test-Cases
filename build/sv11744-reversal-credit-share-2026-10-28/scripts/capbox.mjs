// Screenshot a page and save the boxes of every small element whose text matches a pattern (for annotation).
// usage: node capbox.mjs <env> <tag> <path-with-{cid}|{wo1}|{wo2}> <regex> <outPrefix> [user2]
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,path,re,outp,u2]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,'utf8'));
const o={env,ticket:'11744',dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:1000}};
if(u2){o.user='bilal.muzamil+serviceadvisornoreports@shopview.com'; o.pw=fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim();}
const s=await open(o); const p=s.page;
await s.go(path.replace('{cid}',S.cid).replace('{wo1}',S.wos[0].wo).replace('{wo2}',S.wos[1].wo)); await p.waitForTimeout(5000);
const boxes=await p.evaluate(rs=>{ const R=new RegExp(rs); const out=[]; for(const e of document.querySelectorAll('td,span,div,p,a')){ const t=(e.innerText||'').trim(); if(!t||t.length>80||!R.test(t)) continue; if([...e.children].some(c=>R.test((c.innerText||'').trim()))) continue; const r=e.getBoundingClientRect(); if(r.width<2) continue; out.push({t,x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height}); } return out; },re);
await p.screenshot({path:outp+'.png',fullPage:true}); fs.writeFileSync(outp+'.json',JSON.stringify(boxes)); console.log(boxes.map(b=>`${b.t} @${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.w)}x${Math.round(b.h)}`).join('\n').slice(0,1500));
await s.close(); process.exit(0);

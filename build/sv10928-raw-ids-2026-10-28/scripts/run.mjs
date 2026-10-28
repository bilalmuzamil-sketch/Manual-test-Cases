// node run.mjs <branch|prod> <scenarioName,...> [outDir]
import {open} from '../../testing-tools/qa-session.mjs'; import * as D from './detect.mjs'; import {SCEN} from './scenarios.mjs'; import fs from 'fs';
const env=process.argv[2]; const names=process.argv[3].split(','); const out=process.argv[4]||`/tmp/s10928/${env}`; fs.mkdirSync(out,{recursive:true});
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'});
const ctl={ms:3500,maxShots:3}; await D.install(s,ctl); const p=s.page;
const SHELL=/notifications|release-notes|punch-clock|technician-tasks|feature-flags|view-profile|my-workplaces|preferences|subscribe-token/;
const results=JSON.parse(fs.existsSync(out+'/results.json')?fs.readFileSync(out+'/results.json','utf8'):'{}');
for(const name of names){ const sc=SCEN[name]; const ctx=await sc.setup(s,env); if(ctx&&ctx.skip){ results[name]={skip:ctx.skip}; continue; }
  const pass=async(tag,delay,throttle)=>{ ctl.delay=delay; ctl.tag=`${name}-${tag}`; ctl.shotDir=out; ctl.shots=[]; ctl.seen=new Set();
    const c=throttle?await D.slow4g(p):null;
    await p.goto(s.host.app+'/workorders',{waitUntil:'commit'}).catch(()=>{}); // leave the page so the next load is fresh
    await p.goto(s.host.app+ctx.path,{waitUntil:'commit',timeout:120000}).catch(()=>{});
    await D.reset(p); // drop anything from the previous page
    const wait=throttle?25000:(delay&&delay.has('*'))?14000:delay?ctl.ms+5000:7000;
    await p.waitForTimeout(wait);
    if(sc.action){ await sc.action(s,ctx); await p.waitForTimeout(throttle?20000:delay?ctl.ms+4000:5000); }
    await p.waitForTimeout(1000); const h=(await D.hits(p)).filter(x=>!(sc.ignore&&sc.ignore(x,ctx)));
    await D.fast(p,c); const seen=[...ctl.seen]; ctl.delay=null;
    process.stdout.write(`  ${tag}${delay&&!delay.has('*')?' ['+[...delay][0].slice(0,50)+']':''}: ${h.length} id(s)\n`);
    return {tag,hits:h,shots:ctl.shots.map(x=>x.f),seen}; };
  const base=await pass('base',null,false);
  const look=base.seen.filter(x=>!SHELL.test(x));
  const runs=[base];
  for(const pth of look) runs.push(await pass('delay'+(runs.length),new Set([pth]),false).then(r=>Object.assign(r,{delayed:pth})));
  runs.push(Object.assign(await pass('shell',new Set(base.seen.filter(x=>SHELL.test(x))),false),{delayed:'app-shell group'}));
  runs.push(Object.assign(await pass('all',new Set(['*']),false),{delayed:'every request'}));
  for(let i=1;i<=3;i++) runs.push(Object.assign(await pass('slow4g'+i,null,true),{delayed:'Slow 4G'}));
  if(sc.final){ await sc.final(s,ctx,out,name); }
  results[name]={path:ctx.path,label:ctx.label,passes:runs.length,
    withHits:runs.filter(r=>r.hits.length).map(r=>({tag:r.tag,delayed:r.delayed,hits:r.hits.map(h=>({id:h.id,text:h.text,path:h.path,ms:[h.first,h.last]})),shots:r.shots}))};
  console.log(`${name}: ${runs.length} loads, ${results[name].withHits.length} with an ID on screen`);
  for(const r of results[name].withHits) console.log('   ',r.tag,r.delayed||'',r.hits.slice(0,3).map(h=>h.text.slice(0,60)+' @'+h.path.slice(-60)).join(' | '));
  fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,1)); }
console.log(JSON.stringify(await s.marker())); await s.close();

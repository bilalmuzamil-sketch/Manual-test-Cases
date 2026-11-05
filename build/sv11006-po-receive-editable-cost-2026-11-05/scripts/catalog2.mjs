import {sess} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const t=JSON.stringify((await s.api('/api/fe-permissions')).json); console.log(process.env.ENV||'branch','catalog size',t.length,'later:',(t.match(/.{0,80}[Ll]ater.{0,60}/g)||[]).slice(0,4));
const code=await s.page.evaluate(async()=>{ const srcs=[...document.scripts].map(x=>x.src).filter(Boolean); const hits=[]; for(const u of srcs){ try{ const t=await (await fetch(u)).text(); const m=t.match(/.{0,160}receivedlater.{0,160}/gi); if(m) hits.push(...m.slice(0,2)); }catch(e){} } return hits; });
console.log('bundle',code.slice(0,3)); await s.close(); process.exit(0);

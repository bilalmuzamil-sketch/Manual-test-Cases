// SV-10928 raw-ID flash detector. Watches every visible text node, input/textarea value and tooltip
// for a UUID, from the first frame, and records first/last time seen. Lookups can be slowed one at a
// time (delayOnly) or the whole network throttled to Chrome's "Slow 4G".
export const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
export const DETECT = `(()=>{ if(window.__idw) return; const RX=/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const hits=window.__idHits=window.__idHits||{}; window.__idw=1; const t0=performance.now();
  const vis=e=>{ if(!e||!e.getBoundingClientRect) return false; const r=e.getBoundingClientRect(); if(r.width<1||r.height<1) return false;
    const cs=getComputedStyle(e); return cs.visibility!=='hidden'&&cs.display!=='none'&&+cs.opacity>0.05; };
  const path=e=>{ const a=[]; for(let x=e;x&&x.nodeType===1&&a.length<6;x=x.parentElement){ const tid=x.getAttribute('data-test-id');
      a.unshift(tid?'['+tid+']':(x.tagName.toLowerCase()+(x.className&&typeof x.className==='string'?'.'+x.className.trim().split(/\\s+/).slice(0,2).join('.'):''))); } return a.join('>'); };
  const rec=(text,el,kind)=>{ const m=text.match(RX); if(!m) return; const k=kind+'|'+m[0]+'|'+path(el); const now=Math.round(performance.now()-t0);
    const r=el.getBoundingClientRect();
    if(!hits[k]){ hits[k]={id:m[0],kind,text:text.trim().slice(0,160),path:path(el),url:location.pathname,first:now,last:now,n:1,
      box:{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}}; try{window.__idHit&&window.__idHit(k);}catch(e){} }
    else { hits[k].last=now; hits[k].n++; } };
  const scan=()=>{ if(!document.body) return; const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    for(let n=w.nextNode();n;n=w.nextNode()){ const v=n.nodeValue; if(v&&v.length>=36&&RX.test(v)){ const el=n.parentElement;
      if(el&&!/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)&&vis(el)) rec(v,el,'text'); } }
    for(const el of document.querySelectorAll('input,textarea')){ const v=el.value; if(v&&RX.test(v)&&el.type!=='hidden'&&vis(el)) rec(v,el,'input'); }
    for(const el of document.querySelectorAll('[placeholder],[aria-label],[title]')){ for(const a of ['placeholder','aria-label','title']){ const v=el.getAttribute(a);
      if(v&&RX.test(v)&&vis(el)) rec(v,el,'attr:'+a);} } };
  let dirty=true, fr=0; const loop=()=>{ fr++; if(dirty||fr%10===0){ dirty=false; try{scan();}catch(e){} } requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  new MutationObserver(()=>{dirty=true;}).observe(document,{subtree:true,childList:true,characterData:true,attributes:true});
})();`;
// Chrome DevTools "Slow 4G" preset
export async function slow4g(page){ const c=await page.context().newCDPSession(page);
  await c.send('Network.enable'); await c.send('Network.emulateNetworkConditions',{offline:false,latency:562.5,downloadThroughput:180000,uploadThroughput:84375}); return c; }
export async function fast(page,c){ if(c) await c.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1}); }
// normalised API path: uuids -> :id, query dropped
export const norm = u=>{ try{ const x=new URL(u); return x.pathname.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi,':id'); }catch(e){ return u; } };
// install: detector + per-path delay switch. ctl.delay = Set of normalised paths to hold back; ctl.ms = delay
export async function install(s, ctl){
  const p=s.page; await s.ctx.addInitScript(DETECT); await p.evaluate(DETECT);
  ctl.seen=ctl.seen||new Set(); ctl.shots=ctl.shots||[];
  await p.exposeBinding('__idHit', async(src,k)=>{ if(!ctl.shotDir||ctl.shots.length>=ctl.maxShots) return;
    const f=`${ctl.shotDir}/${ctl.tag||'hit'}-${ctl.shots.length+1}.png`; ctl.shots.push({k,f}); await p.screenshot({path:f}).catch(()=>{}); }).catch(()=>{});
  await s.ctx.route(u=>/^https:\/\/[^/]*api[^/]*\.shopview\.com\/api\//.test(u.toString()), async route=>{ const r=route.request(); const n=norm(r.url());
    if(r.method()==='GET') ctl.seen.add(n);
    if(r.method()==='GET' && ctl.delay && (ctl.delay.has(n)||ctl.delay.has('*'))){ await new Promise(z=>setTimeout(z,ctl.ms||3500)); }
    await route.continue().catch(()=>{}); });
}
export async function reset(p){ await p.evaluate(()=>{ for(const k in (window.__idHits||{})) delete window.__idHits[k]; }).catch(()=>{}); }
export async function hits(p){ return p.evaluate(()=>Object.values(window.__idHits||{})).catch(()=>[]); }

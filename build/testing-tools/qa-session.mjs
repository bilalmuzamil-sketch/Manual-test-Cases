// Reusable QA session harness. ONE login per environment, held open for the whole pass.
// Replaces the "one script per question, full login each time" pattern that cost ~41s of
// fixed sleeping per probe. See APP-ACTIONS-PLAYBOOK.md §U.2.
//
//   import {open, parallel} from '.../qa-session.mjs'
//   const s = await open({env:'prod'})                       // or {env:'branch', ticket:'10442'}
//   const lines = await s.api('/api/work-orders/lines/'+wo)  // in-page fetch, cookies included
//   await s.go('/workorders/'+wo+'/lines')                   // waits for network idle, not a clock
//   const tip = await s.hoverTip('menu-item_delete_line_'+id)
//   await s.shot('delete-tooltip'); await s.close()
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const {chromium}=pkg;
import fs from 'fs';

const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const PROD={app:'https://app.shopview.com', api:'https://api.shopview.com'};
const STAGING={app:'https://app.staging.shopview.com', api:'https://api.staging.shopview.com'};
const branch=t=>({app:`https://sv${t}.qa.shopview.com`, api:`https://sv${t}api.qa.shopview.com`});
// Cookies are scoped per environment: the QA branches live under .qa.shopview.com, while
// production and staging both sit under .shopview.com. Sending a cookie on the wrong domain
// silently authenticates nothing and the app just redirects to login.
const cookieDomain = env => env==='branch' ? '.qa.shopview.com' : '.shopview.com';

function port(dir){ return fs.readFileSync(dir+'/port.txt','utf8').trim(); }

export async function open({env='prod', ticket=null, dir='/tmp/qa', user=null, pw='analyst1',
                            cookies=null, vp={width:1900,height:1100}, dpr=1, quiet=true, record=null}={}){
  // record: a folder path -> the whole session is filmed (see recording.mjs: finishRecording()).
  const H = env==='prod' ? PROD : env==='staging' ? STAGING : branch(ticket);
  const b = await chromium.launch({executablePath:CHROME, args:[
    '--proxy-server=http://127.0.0.1:'+port(dir),'--ignore-certificate-errors','--no-sandbox','--ssl-version-max=tls1.2']});
  const ctx = await b.newContext(Object.assign({viewport:vp, deviceScaleFactor:dpr, ignoreHTTPSErrors:true},
    record ? {recordVideo:{dir:record, size:vp}} : {}));
  // Recordings do not show the mouse: draw a pointer, a click ripple and a caption bar into every page.
  if (record) await ctx.addInitScript(RECORD_OVERLAY);
  if (cookies) await ctx.addCookies(Object.entries(cookies).map(([name,value])=>
    ({name, value, domain:cookieDomain(env), path:'/'})));
  const p = await ctx.newPage();
  const t0 = Date.now(); let recStart = null;
  const writes=[];
  p.on('response', r=>{ try{ const u=new URL(r.url());
    if(u.pathname.startsWith('/api') && r.request().method()!=='GET')
      writes.push(`${r.request().method()} ${r.status()} ${u.pathname} :: ${(r.request().postData()||'').slice(0,240)}`);
  }catch(e){} });

  const settle = async (ms=1200)=>{ await p.waitForLoadState('domcontentloaded').catch(()=>{});
    await p.waitForLoadState('networkidle',{timeout:20000}).catch(()=>{}); await p.waitForTimeout(ms); };

  await p.goto(H.app+'/login',{waitUntil:'commit',timeout:120000}); await settle();
  if (env==='prod'){
    await p.fill('[data-test-id="input_email"]', user).catch(async()=>{ await p.fill('input[type=email]',user).catch(()=>{}); });
    await p.fill('[data-test-id="input_password"]', pw).catch(async()=>{ await p.fill('input[type=password]',pw).catch(()=>{}); });
    const btn=p.locator('button').filter({hasText:/log ?in|sign ?in/i}).first();
    if(await btn.count()){ const bb=await btn.boundingBox(); await p.mouse.click(bb.x+bb.width/2, bb.y+bb.height/2); }
    await p.waitForURL(u=>!/\/login/.test(u.toString()),{timeout:60000}).catch(()=>{});
  } else if (env==='staging'){
    // Cookies authenticate the API, but the SPA keeps its own auth state, so a cookie-only
    // context still bounces to /login. Staging carries the same dev quick-login panel the
    // per-ticket branches have — one click hydrates the app.
    await p.click('[data-test-id="button_quick_login_admin"]').catch(()=>{});
    await p.waitForURL(u=>!/\/login/.test(u.toString()),{timeout:60000}).catch(()=>{});
  } else {
    // per-ticket branches park themselves: click Wake Up until the app renders
    for(let i=0;i<8;i++){
      const w=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,a')]
        .find(x=>/^wake up$/i.test((x.innerText||'').trim())); if(!e)return null;
        const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
      if(!w) break;
      await p.mouse.click(w.x,w.y); await p.waitForTimeout(40000);
      await p.goto(H.app+'/login',{waitUntil:'domcontentloaded',timeout:120000}); await settle();
    }
    await p.click('[data-test-id="button_quick_login_admin"]').catch(()=>{});
    await p.waitForURL(u=>!/\/login/.test(u.toString()),{timeout:60000}).catch(()=>{});
  }
  await settle();
  recStart = (Date.now()-t0)/1000;   // the film is trimmed to start here: no login screen in the recording

  const s = {
    browser:b, ctx, page:p, host:H, writes,
    async go(path){ await p.goto(H.app+path,{waitUntil:'commit',timeout:120000}); await settle(); return p.url(); },
    // in-page fetch so the session cookies and origin are the app's own
    async api(path, init=null){ return p.evaluate(async([base,pth,ini])=>{
        const r=await fetch(base+pth, Object.assign({credentials:'include'}, ini?JSON.parse(ini):{}));
        const t=await r.text(); try{ return {status:r.status, json:JSON.parse(t)}; }catch(e){ return {status:r.status, text:t}; }
      },[H.api,path, init?JSON.stringify(init):null]); },
    // wait for a test-id rather than sleeping
    async waitFor(tid,{timeout=30000}={}){ return p.waitForSelector(`[data-test-id="${tid}"]`,{timeout}).then(()=>true,()=>false); },
    async box(tid){ return p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); if(!e)return null;
      const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,
        bx:Math.round(r.x),by:Math.round(r.y),bw:Math.round(r.width),bh:Math.round(r.height)};},tid); },
    // hover a control and return whatever tooltip appears, with its real geometry (for annotation)
    async hoverTip(tid,{wait=2200}={}){ const bx=await s.box(tid); if(!bx) return {box:null,tips:[]};
      await p.mouse.move(bx.x,bx.y); await p.waitForTimeout(wait);
      const tips=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')]
        .filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();
          return {text:(e.innerText||'').trim(),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};}));
      return {box:bx, tips}; },
    // Standing Rule 102: click a confirm button, then RE-READ the dialog. ShopView often asks twice
    // (Yes -> orange "Are You Sure?", test-id ending _confirmation_answer). Keeps clicking the changed
    // button until the dialog closes or stops changing; returns every step so the caller can screenshot/report it.
    async confirm(tid,{maxSteps=3,wait=1500,shotPrefix=null}={}){
      const read=()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog button,.q-menu .q-item')]
        .filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();
          return {t:(e.innerText||'').trim(),tid:e.getAttribute('data-test-id'),x:r.x+r.width/2,y:r.y+r.height/2};}));
      const steps=[]; let target=await s.box(tid); if(!target) return {steps,error:'not found: '+tid};
      for(let i=0;i<maxSteps;i++){
        await p.mouse.click(target.x,target.y); await p.waitForTimeout(wait);
        if(shotPrefix) await p.screenshot({path:`${shotPrefix}-confirm-${i+1}.png`});
        const now=await read(); steps.push(now.map(b=>b.t+' ['+b.tid+']'));
        const next=now.find(b=>/are you sure|confirm/i.test(b.t)||/_confirmation_answer$/.test(b.tid||''));
        if(!next) break; target=next;
      }
      return {steps}; },
    async shot(name,dir2='/tmp/qa'){ const f=`${dir2}/${name}.png`; await p.screenshot({path:f}); return f; },
    async marker(){ return p.evaluate(async base=>{ const r=await fetch(base+'/index.html',{cache:'no-store'});
        const t=await r.text(); const m=t.match(/name="app-version" content="([^"]+)"/);
        return {version:m&&m[1], lastModified:r.headers.get('last-modified'), etag:r.headers.get('etag')};},H.app); },
    // recording-friendly moves: the pointer glides (so the viewer sees where it goes) and controls are scrolled into view
    async glideClick(tid){ await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),tid);
      await p.waitForTimeout(250); const b=await s.box(tid); if(!b) throw new Error('not on screen: '+tid);
      await p.mouse.move(b.x,b.y,{steps:18}); await p.waitForTimeout(250); await p.mouse.click(b.x,b.y); return b; },
    // point AT a value without covering it: park the pointer just left of the element
    async pointBeside(tid){ const b=await s.box(tid); if(!b) return null; await p.mouse.move(b.bx-22,b.y,{steps:18}); return b; },
    // show a plain-English caption on screen (it is filmed); pass '' to hide it
    async caption(text,{hold=1800}={}){ await p.evaluate(t=>window.__qaCaption&&window.__qaCaption(t),text).catch(()=>{});
      if(text&&hold) await p.waitForTimeout(hold); },
    // close; when recording, returns {video, startSec} for finishRecording()
    async close(){ const v = record ? p.video() : null; await ctx.close(); await b.close();
      return v ? {video: await v.path(), startSec: recStart} : null; },
  };
  return s;
}

const RECORD_OVERLAY = `(()=>{ if(window.__qaOverlay) return; window.__qaOverlay=1;
  const add=()=>{ if(!document.body) return setTimeout(add,50);
    const c=document.createElement('div'); c.id='__qa_cursor';
    c.style.cssText='position:fixed;left:-40px;top:-40px;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:rgba(255,40,40,.55);border:2px solid #fff;box-shadow:0 0 0 2px rgba(200,0,0,.8);z-index:2147483647;pointer-events:none;transition:transform .12s';
    const cap=document.createElement('div'); cap.id='__qa_caption';
    cap.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);max-width:80%;padding:10px 18px;background:rgba(20,20,20,.86);color:#fff;font:600 26px/1.35 sans-serif;border-radius:8px;z-index:2147483647;pointer-events:none;display:none;text-align:center';
    document.body.append(c,cap);
    window.__qaCaption=t=>{cap.textContent=t||''; cap.style.display=t?'block':'none'; try{sessionStorage.setItem('__qaCap',t||'');}catch(e){}};
    try{ const k=sessionStorage.getItem('__qaCap'); if(k) window.__qaCaption(k); }catch(e){}
    addEventListener('mousemove',e=>{c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';},true);
    addEventListener('mousedown',e=>{c.style.transform='scale(1.8)'; const r=document.createElement('div');
      r.style.cssText='position:fixed;left:'+e.clientX+'px;top:'+e.clientY+'px;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;border:3px solid #e00;z-index:2147483646;pointer-events:none;transition:all .6s ease-out';
      document.body.append(r); requestAnimationFrame(()=>{r.style.width=r.style.height='70px';r.style.margin='-35px 0 0 -35px';r.style.opacity='0';});
      setTimeout(()=>r.remove(),700);},true);
    addEventListener('mouseup',()=>{c.style.transform='scale(1)';},true); };
  add(); })();`;

// Run independent environment work concurrently (prod BEFORE alongside branch AFTER).
export async function parallel(tasks){ return Promise.all(tasks.map(t=>t())); }

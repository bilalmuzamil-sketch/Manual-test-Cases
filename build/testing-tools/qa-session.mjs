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
const branch=t=>({app:`https://sv${t}.qa.shopview.com`, api:`https://sv${t}api.qa.shopview.com`});

function port(dir){ return fs.readFileSync(dir+'/port.txt','utf8').trim(); }

export async function open({env='prod', ticket=null, dir='/tmp/qa', user=null, pw='analyst1',
                            cookies=null, vp={width:1900,height:1100}, quiet=true}={}){
  const H = env==='prod' ? PROD : branch(ticket);
  const b = await chromium.launch({executablePath:CHROME, args:[
    '--proxy-server=http://127.0.0.1:'+port(dir),'--ignore-certificate-errors','--no-sandbox','--ssl-version-max=tls1.2']});
  const ctx = await b.newContext({viewport:vp, ignoreHTTPSErrors:true});
  if (cookies) await ctx.addCookies(Object.entries(cookies).map(([name,value])=>
    ({name, value, domain:'.qa.shopview.com', path:'/'})));
  const p = await ctx.newPage();
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
    async shot(name,dir2='/tmp/qa'){ const f=`${dir2}/${name}.png`; await p.screenshot({path:f}); return f; },
    async marker(){ return p.evaluate(async base=>{ const r=await fetch(base+'/index.html',{cache:'no-store'});
        const t=await r.text(); const m=t.match(/name="app-version" content="([^"]+)"/);
        return {version:m&&m[1], lastModified:r.headers.get('last-modified'), etag:r.headers.get('etag')};},H.app); },
    async close(){ await b.close(); },
  };
  return s;
}

// Run independent environment work concurrently (prod BEFORE alongside branch AFTER).
export async function parallel(tasks){ return Promise.all(tasks.map(t=>t())); }

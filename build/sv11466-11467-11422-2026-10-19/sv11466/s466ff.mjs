// SV-11466 Firefox check: Board View's sideways scroll bar in Firefox (should be Firefox's own standard bar)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const {firefox}=pkg; import fs from 'fs';
const P=fs.readFileSync('/tmp/qa11310/port.txt','utf8').trim(); const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const b=await firefox.launch({executablePath:'/tmp/pwff/firefox-1495/firefox/firefox',proxy:{server:'http://127.0.0.1:'+P},headless:false,args:['-width','1440','-height','1000'],env:{...process.env,GTK_OVERLAY_SCROLLING:'0'},firefoxUserPrefs:{'widget.gtk.overlay-scrollbars.enabled':false,'ui.useOverlayScrollbars':0}});
const ctx=await b.newContext({viewport:null,ignoreHTTPSErrors:true});
await ctx.addCookies(Object.entries(C).map(([name,value])=>({name,value,domain:'.shopview.com',path:'/'})));
const p=await ctx.newPage(); const out={ua:await p.evaluate(()=>navigator.userAgent)};
await p.goto('https://app.staging.shopview.com/login',{waitUntil:'commit',timeout:120000}); await p.waitForTimeout(5000);
await p.click('[data-test-id="button_quick_login_admin"]').catch(e=>out.qerr=e.message.slice(0,100));
await p.waitForURL(u=>!/\/login/.test(u.toString()),{timeout:60000}).catch(()=>{}); await p.waitForTimeout(3000);
out.ver=await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
await p.goto('https://app.staging.shopview.com/workorders?tab=all'); await p.waitForTimeout(6000);
await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(800); await p.click('[data-test-id=display_option_board_view]'); await p.waitForTimeout(6000); await p.keyboard.press('Escape').catch(()=>{});
out.g=await p.evaluate(()=>{const e=document.querySelector('[data-test-id=board_view_scroller]'); if(!e) return null; const b=e.getBoundingClientRect(); const cs=getComputedStyle(e); return {x:b.x,y:b.y,w:b.width,h:b.height,thickH:e.offsetHeight-e.clientHeight,sw:e.scrollWidth,cw:e.clientWidth,scrollbarWidth:cs.scrollbarWidth,scrollbarColor:cs.scrollbarColor,top:document.body.innerText.slice(0,0)};});
out.ua_check=await p.evaluate(()=>{const d=document.createElement('div'); d.style.cssText='width:100px;height:50px;overflow:scroll'; document.body.appendChild(d); const r={html:getComputedStyle(document.documentElement).scrollbarWidth, plainDiv:getComputedStyle(d).scrollbarWidth, plainThick:d.offsetHeight-d.clientHeight, colBody:getComputedStyle(document.querySelector('.board-column__body')).scrollbarWidth}; d.remove(); return r;});
out.rules=await p.evaluate(()=>{const e=document.querySelector('[data-test-id=board_view_scroller]'); const r=[]; for(const sh of document.styleSheets){ let rs; try{rs=sh.cssRules}catch(x){r.push('XORIGIN '+sh.href); continue} const walk=list=>{ for(const ru of list){ if(ru.cssRules&&!ru.selectorText) { walk(ru.cssRules); continue;} if(/scrollbar-width/.test(ru.cssText||'')){ let m='?'; try{ m=ru.selectorText? e.matches(ru.selectorText):'nosel'; }catch(x){m='err'} r.push(m+' :: '+(ru.cssText||'').slice(0,200)); } } }; walk(rs);} return {cls:e.className,inline:e.getAttribute('style'),r};});
await p.screenshot({path:'/tmp/qa11310/s466/firefox-1440-board.png'});
// drag the bar to the far right: Firefox's own handle
if(out.g){ const g=out.g; const y=g.y+g.h-Math.max(g.thickH,6)/2; await p.mouse.move(g.x+20,y); await p.mouse.down(); await p.mouse.move(g.x+g.w+300,y,{steps:30}); await p.mouse.up(); await p.waitForTimeout(2000);
 out.after=await p.evaluate(()=>{const e=document.querySelector('[data-test-id=board_view_scroller]'); return {sl:e.scrollLeft,max:e.scrollWidth-e.clientWidth};}); }
fs.writeFileSync('/tmp/qa11310/s466/firefox-1440-board.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out)); await b.close();

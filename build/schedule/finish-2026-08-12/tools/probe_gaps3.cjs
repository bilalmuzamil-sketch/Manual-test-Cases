const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs = require('fs');
const out={}; const R=`${OUT}/gaps3.json`;
const SNAP=()=>{const vis=e=>{const r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return false;const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01;};
 const t=new Set(),i=new Set();document.querySelectorAll('*').forEach(e=>{if(!vis(e))return;const d=e.getAttribute('data-test-id');if(d)i.add(d);
 let o='';e.childNodes.forEach(n=>{if(n.nodeType===3)o+=n.nodeValue;});o=o.replace(/\s+/g,' ').trim();if(o&&o.length<=140)t.add(o);});
 const p=[];document.querySelectorAll('.q-menu,.q-dialog,[role="dialog"],[role="menu"],.q-tooltip').forEach(d=>{if(vis(d))p.push({text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,1500)});});
 return {texts:[...t],ids:[...i],panels:p};};
async function snap(page,n,ms=1800){await page.waitForTimeout(ms);const s=await page.evaluate(SNAP);out[n]=s;fs.writeFileSync(R,JSON.stringify(out,null,1));
 console.log(`  [${n}] ${s.panels.length} panel(s) :: ${(s.panels[0]||{text:''}).text.slice(0,150)}`);return s;}
(async()=>{const h=await makeHarness('g3');const page=h.page;
 try{
  // A: locations -> business hours
  for(const r of ['/administration/locations','/administration/settings']){
    await page.goto(APP+r,{waitUntil:'domcontentloaded',timeout:120000}); await page.waitForTimeout(7000);
    await snap(page,'route'+r.replace(/\W/g,'_'),1400);
    const hit=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
      const el=[...document.querySelectorAll('tr,.q-item,button,.q-btn,td')].filter(vis).find(e=>/edit|Heavy Duty|Business/i.test(e.innerText||'')&&(e.innerText||'').length<160);
      if(!el)return null;el.scrollIntoView({block:'center'});el.click();return (el.innerText||'').replace(/\s+/g,' ').slice(0,80);});
    console.log('   clicked:',hit);
    if(hit){await snap(page,'after'+r.replace(/\W/g,'_'),2600);await page.screenshot({path:`${OUT}/g3${r.replace(/\W/g,'_')}.png`,fullPage:true}).catch(()=>{});}
  }
  // B: month view day cell
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000}); await page.waitForTimeout(10000);
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const b=[...document.querySelectorAll('button,.q-btn,div,span')].filter(vis).find(e=>(e.innerText||'').trim()==='Month');if(b)b.click();});
  await page.waitForTimeout(3000);
  const cells=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const cal=document.querySelector('[data-test-id="schedule_calendar"]');if(!cal)return null;
    const c=[...cal.querySelectorAll('div')].filter(e=>{if(!vis(e))return false;const r=e.getBoundingClientRect();
      return r.width>70&&r.width<300&&r.height>50&&r.height<220&&!e.querySelector('[data-test-id*="block"]');});
    if(!c.length)return{n:0};const t=c[Math.floor(c.length/2)];t.scrollIntoView({block:'center'});
    return new Promise(res=>setTimeout(()=>{const r=t.getBoundingClientRect();
      res({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),n:c.length,on:r.y>60&&r.y<innerHeight-40});},600));});
  console.log('   month cell:',JSON.stringify(cells));
  if(cells&&cells.on){await page.mouse.click(cells.x,cells.y);await snap(page,'month-cell-click',1900);
    await page.screenshot({path:`${OUT}/g3-month-cell.png`}).catch(()=>{});await page.keyboard.press('Escape');
    await page.waitForTimeout(600);await page.mouse.click(cells.x,cells.y,{button:'right'});await snap(page,'month-cell-right',1900);}
 }catch(e){console.log('FATAL',String(e).slice(0,200));}
 console.log('NON-GET:',JSON.stringify(h.apiLog.filter(a=>a.m!=='GET')));
 await h.browser.close();})();

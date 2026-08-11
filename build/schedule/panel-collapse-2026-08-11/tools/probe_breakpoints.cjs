const {boot,APP}=require('./boot.cjs');
const fs=require('fs');
(async()=>{
  const out={widths:[]};
  for (const W of [1680,1200,959,900,760,600]) {
    const {browser,page}=await boot({ctx:{viewport:{width:W,height:900}}});
    await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:180000});
    await page.waitForTimeout(11000);
    const r=await page.evaluate(()=>{
      const R=s=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();
        const cs=getComputedStyle(e);return{x:Math.round(b.x),w:Math.round(b.width),h:Math.round(b.height),disp:cs.display,vis:cs.visibility};};
      // the WHOLE left panel = the flex child of schedule_page that holds the mini calendar
      const mc=document.querySelector('[data-test-id="schedule_mini_calendar"]');
      let panel=null;
      if(mc){let n=mc.parentElement; while(n&&n.parentElement&&n.parentElement.getAttribute('data-test-id')!=='schedule_page') n=n.parentElement;
        if(n){const b=n.getBoundingClientRect();panel={x:Math.round(b.x),w:Math.round(b.width),cls:(n.className||'').toString().slice(0,60),disp:getComputedStyle(n).display};}}
      return {vw:window.innerWidth, panel, sidebar:R('[data-test-id="schedule_sidebar"]'),
        miniCal:R('[data-test-id="schedule_mini_calendar"]'), grid:R('[data-test-id="schedule_calendar"]'),
        mobileMenu:!!document.querySelector('[data-test-id="button_open_mobile_menu"]'),
        panelStr:['Hide panel','Show panel','panel-left','Panel toggle'].filter(s=>document.documentElement.innerHTML.includes(s)),
        leftOfToday:(()=>{const t=document.querySelector('[data-test-id="button_schedule_today"]');if(!t)return 'no-today';
          const tb=t.getBoundingClientRect();
          return [...document.querySelectorAll('button,[role="button"]')].map(e=>{const b=e.getBoundingClientRect();
            return{tid:e.getAttribute('data-test-id'),aria:e.getAttribute('aria-label'),txt:(e.innerText||'').trim().slice(0,18),x:Math.round(b.x),y:Math.round(b.y)};})
            .filter(b=>b.x<tb.x&&Math.abs(b.y-tb.y)<26&&b.x>0);})()};
    });
    out.widths.push(r);
    await page.screenshot({path:'/tmp/sch-panel/evidence/w'+W+'.png'});
    console.log(`--- viewport ${W} --- vw=${r.vw} mobileMenu=${r.mobileMenu}`);
    console.log(`   whole left panel: ${JSON.stringify(r.panel)}`);
    console.log(`   mini calendar   : ${JSON.stringify(r.miniCal)}`);
    console.log(`   sidebar (WO list): ${JSON.stringify(r.sidebar)}`);
    console.log(`   grid            : ${JSON.stringify(r.grid)}`);
    console.log(`   panel strings   : ${JSON.stringify(r.panelStr)}`);
    console.log(`   buttons LEFT of Today on its row: ${JSON.stringify(r.leftOfToday)}`);
    await browser.close();
  }
  fs.writeFileSync('/tmp/sch-panel/evidence/breakpoints.json',JSON.stringify(out,null,1));
})().catch(e=>console.log('ERR',e.message));

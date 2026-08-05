import * as H from './h.mjs';
const MOB={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:3,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
const {browser,page}=await H.open({...MOB,settle:18000});
await H.resetFilters(page); await page.waitForTimeout(2500);
const before=await page.evaluate(()=>document.body.innerHTML.length);
await page.locator('[data-test-id="filter_chip_status"]').first().click({timeout:20000});
await page.waitForTimeout(3500);
const d=await page.evaluate(()=>{
  const vis=e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed';
  const cands=[...document.querySelectorAll('div,section,aside')].filter(e=>{
    if(!vis(e)) return false; const cs=getComputedStyle(e);
    return (cs.position==='fixed'||cs.position==='absolute') && e.getBoundingClientRect().height>120 && e.querySelector('[data-test-id^=filter_option],[role=checkbox]');
  });
  return {n:cands.length,
    cands:cands.slice(0,4).map(e=>({cls:e.className.toString().slice(0,130),h:Math.round(e.getBoundingClientRect().height),y:Math.round(e.getBoundingClientRect().y),
      text:e.innerText.slice(0,500),
      buttons:[...e.querySelectorAll('button')].map(b=>({t:b.innerText.trim(),testid:b.getAttribute('data-test-id')})).filter(b=>b.t||b.testid).slice(0,20),
      testIds:[...e.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')).slice(0,40)})),
    anyApply:[...document.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)||/apply/i.test(b.getAttribute('data-test-id')||'')).map(b=>({EXACT:JSON.stringify(b.innerText),testid:b.getAttribute('data-test-id'),visible:b.offsetParent!==null})),
    dialogs:document.querySelectorAll('.q-dialog').length, menus:document.querySelectorAll('.q-menu').length,
    bodyDelta:document.body.innerHTML.length,
    optionEls:document.querySelectorAll('[data-test-id^=filter_option]').length,
    url:location.href};
});
console.log(JSON.stringify(d,null,1).slice(0,4200));
await page.screenshot({path:'/tmp/fv/shots/mob-probe.png'});
await browser.close();

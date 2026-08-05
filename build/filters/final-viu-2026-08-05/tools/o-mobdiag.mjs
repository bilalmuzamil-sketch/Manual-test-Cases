import * as H from './h.mjs';
const MOB={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:3,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
const {browser,page}=await H.open({...MOB,settle:20000});
console.log('URL',page.url());
const d=await page.evaluate(()=>({
  bodyText:document.body.innerText.slice(0,1200),
  filterChipCount:document.querySelectorAll('button.filter-chip').length,
  chipLikeClasses:[...new Set([...document.querySelectorAll('button')].map(b=>b.className).filter(c=>/chip|filter/i.test(c)))].slice(0,10),
  testIds:[...new Set([...document.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')))].filter(t=>/filter|chip|apply|search|status/i.test(t)).slice(0,50),
  tbodyRows:document.querySelectorAll('tbody tr').length, tables:document.querySelectorAll('table').length
}));
console.log(JSON.stringify(d,null,1).slice(0,3000));
await page.screenshot({path:'/tmp/fv/shots/mob-diag.png'});
await browser.close();

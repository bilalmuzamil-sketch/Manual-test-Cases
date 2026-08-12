// The reports navigation tree: which GROUP heading each of the six reports sits under.
// Six cases (one per report) assert the group by name, and the group question is also
// one of the open items with Chris Ward — so this is read, not assumed.
const {boot,APP,RENDERED}=require('./harness.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/verify-final-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const {browser,page,bridgeErrors}=await boot();
  await page.goto(APP+'/reports/work-in-progress',{waitUntil:'domcontentloaded',timeout:120000});
  await sleep(9000);
  // open the Reports nav
  const nav=await page.$('[data-test-id=button_desktop_nav_link]:has-text("Reports")');
  if(nav){ await nav.click().catch(()=>{}); await sleep(2500); }
  const tree=await page.evaluate(`(()=>{${RENDERED}
    // walk every report_nav_* element in DOM order, recording group headings as we pass them
    const els=[...document.querySelectorAll('[data-test-id^=report_nav_]')];
    return els.map(e=>{
      const l=__lab(e);
      return {tid:e.getAttribute('data-test-id'), tc:l.tc, it:l.it, tt:l.tt,
              isGroup:/^report_nav_group_/.test(e.getAttribute('data-test-id')),
              depth:(()=>{let d=0,p=e;while(p&&p!==document.body){d++;p=p.parentElement;}return d;})()};
    });
  })()`);
  fs.writeFileSync(OUT+'nav-tree.json',JSON.stringify({tree,bridgeErrors,at:new Date().toISOString()},null,1));
  let group='(none yet)';
  for(const n of tree){
    if(n.isGroup){ group=n.it||n.tc; console.log('GROUP:',JSON.stringify(group)); }
    else console.log('   ',group,'->',n.tid,JSON.stringify(n.it||n.tc));
  }
  console.log('bridge_errors',bridgeErrors.length);
  await browser.close();
})();

const {boot}=require('./bootF.cjs');
const dump=p=>p.evaluate(()=>{const s=new Set();document.querySelectorAll('[data-test-id]').forEach(e=>s.add(e.getAttribute('data-test-id')));return [...s];});
const vis=p=>p.evaluate(()=>[...new Set(Array.from(document.querySelectorAll('button')).filter(b=>b.offsetParent!==null).map(b=>((b.getAttribute('data-test-id')||'?')+' :: '+(b.innerText||b.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ')).slice(0,64)))]);
(async()=>{
  const {page,apiLog}=await boot({ctx:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3}});
  await page.waitForTimeout(5000);

  console.log('===== SV-8912: tap the magnifier =====');
  await page.click('[data-test-id=button_open_mobile_search]');
  await page.waitForTimeout(2500);
  console.log('URL after tap:', page.url());
  const afterIds=await dump(page);
  console.log('has select_global_search:', afterIds.includes('select_global_search'));
  console.log('has page_search_toggle  :', afterIds.includes('page_search_toggle'));
  const inputs=await page.evaluate(()=>Array.from(document.querySelectorAll('input')).filter(i=>i.offsetParent!==null).map(i=>({ph:i.placeholder||'',dt:i.getAttribute('data-test-id')||'',aria:i.getAttribute('aria-label')||''})));
  console.log('visible inputs:', JSON.stringify(inputs));
  await page.screenshot({path:'/tmp/efa/ev-8912-magnifier.png'});
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});

const {boot}=require('./bootF.cjs');
const ids=()=>Array.from(document.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id'));
(async()=>{
  const {page}=await boot({ctx:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3}});
  await page.waitForTimeout(5000);
  console.log('URL', page.url());
  const uniq=await page.evaluate(()=>{
    const s=new Set(); document.querySelectorAll('[data-test-id]').forEach(e=>s.add(e.getAttribute('data-test-id')));
    return [...s];
  });
  console.log('\n--- unique data-test-ids on phone ---');
  console.log(uniq.join('\n'));
  console.log('\n--- SV-8912: page search present? ---');
  console.log('page_search_toggle:', uniq.includes('page_search_toggle'));
  console.log('select_global_search:', uniq.includes('select_global_search'));
  console.log('\n--- visible button labels ---');
  const labs=await page.evaluate(()=>Array.from(document.querySelectorAll('button')).filter(b=>b.offsetParent!==null).map(b=>((b.getAttribute('data-test-id')||'')+' :: '+(b.innerText||b.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ')).slice(0,70)));
  console.log([...new Set(labs)].join('\n'));
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});

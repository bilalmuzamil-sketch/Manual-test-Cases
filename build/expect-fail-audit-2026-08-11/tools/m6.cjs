const {boot}=require('./bootF.cjs');
(async()=>{
  const {page,apiLog,APP}=await boot({ctx:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3}});
  await page.waitForTimeout(4000);
  for(const st of ['declined','paid','imported']){
    const n0=apiLog.length;
    await page.goto(APP+'/workorders?status='+st+'&tab=all',{waitUntil:'domcontentloaded',timeout:90000});
    await page.waitForTimeout(5000);
    const reqs=apiLog.slice(n0).filter(a=>/\/api\/work-orders\?/.test(a.u));
    const sent=reqs.map(a=>{const m=a.u.match(/filters(?:%5B|\[)0(?:%5D|\])(?:%5B|\[)value(?:%5D|\])=([^&]*)/i);return m?decodeURIComponent(m[1]):'(no filters[0][value])';});
    const ui=await page.evaluate(()=>({
      chip:(document.querySelector('[data-test-id=filter_chip_status]')||{}).innerText?.trim().replace(/\s+/g,' ')||'',
      rows:document.querySelectorAll('[data-test-id=work_order_mobile_card]').length,
      clear:/clear\s*filters/i.test(document.body.innerText)
    }));
    console.log(`?status=${st.padEnd(9)} | filters[0][value] sent: ${JSON.stringify(sent)} | chip="${ui.chip}" | cards=${ui.rows} | "Clear Filters" text present=${ui.clear}`);
  }
  console.log('\n===== SV-8846: with a filter ON, is there a Clear Filters control? =====');
  const btns=await page.evaluate(()=>[...new Set(Array.from(document.querySelectorAll('button,[data-test-id]')).filter(b=>b.offsetParent!==null).map(b=>((b.getAttribute('data-test-id')||'?')+' :: '+(b.innerText||'').trim().replace(/\s+/g,' ')).slice(0,62)))]);
  console.log(btns.join('\n'));
  await page.screenshot({path:'/tmp/efa/ev-8845-8846.png'});
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});

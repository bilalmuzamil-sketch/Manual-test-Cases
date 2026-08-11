const {boot}=require('./bootF.cjs');
(async()=>{
  const {page,apiLog}=await boot({ctx:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3}});
  await page.waitForTimeout(5000);
  console.log('===== C29625 / SV-8875: the Customer chip sheet on a phone =====');
  await page.click('[data-test-id=filter_chip_company_id]');
  await page.waitForTimeout(3500);
  const s=await page.evaluate(()=>({
    apply:/apply\s*filters/i.test(document.body.innerText),
    search:Array.from(document.querySelectorAll('input')).filter(i=>i.offsetParent!==null).map(i=>({dt:i.getAttribute('data-test-id')||'',ph:i.placeholder||'',type:i.type})),
    clearSel:!!document.querySelector('[data-test-id^=filter_clear_selection]'),
    sheetOpen:!!document.querySelector('[data-test-id=mobile_filter_sheet_close]'),
    tags:document.querySelectorAll('.q-chip,[data-test-id*=tag]').length
  }));
  console.log('Apply filters button present:',s.apply);
  console.log('search input in sheet:',JSON.stringify(s.search));
  console.log('Clear Selection present:',s.clearSel,'| sheet open:',s.sheetOpen,'| chip/tag elements:',s.tags);
  const rows=await page.evaluate(()=>[...document.querySelectorAll('.q-item')].map(e=>{const b=e.getBoundingClientRect();return{t:(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,28),x:b.x+b.width/2,y:b.y+b.height/2};}).filter(r=>r.x>0&&r.y>100&&r.y<840&&r.t));
  console.log('option rows visible:',rows.length,JSON.stringify(rows.slice(0,4)));
  if(rows.length){
    const u0=page.url(),n0=apiLog.length;
    await page.mouse.click(rows[0].x,rows[0].y); await page.waitForTimeout(3000);
    console.log('\nticked:',rows[0].t);
    console.log('URL changed immediately:',u0!==page.url(),'->',page.url().slice(-70));
    console.log('list request fired at once:',apiLog.slice(n0).some(a=>/\/api\/work-orders\?/.test(a.u)));
    console.log('sheet closed after one tick:',!(await page.evaluate(()=>!!document.querySelector('[data-test-id=mobile_filter_sheet_close]'))));
  }
  await page.screenshot({path:'/tmp/efa/ev-29625-customer.png'});
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});

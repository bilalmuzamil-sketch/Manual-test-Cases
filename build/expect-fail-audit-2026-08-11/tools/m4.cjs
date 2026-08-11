const {boot}=require('./bootF.cjs');
(async()=>{
  const {page,apiLog}=await boot({ctx:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3}});
  await page.waitForTimeout(5000);
  await page.click('[data-test-id=filter_chip_status]');
  await page.waitForTimeout(2500);
  const s=await page.evaluate(()=>({
    cbs:document.querySelectorAll('input[type=checkbox],[role=checkbox],.q-checkbox').length,
    hasApply:/apply\s*filters/i.test(document.body.innerText),
    sheetText:(document.querySelector('.q-dialog,[role=dialog],.q-bottom-sheet')||document.body).innerText.replace(/\s+/g,' ').slice(0,300)
  }));
  console.log('checkbox-ish:',s.cbs,'| "Apply filters" present:',s.hasApply);
  console.log('SHEET TEXT:',s.sheetText);
  // visible clickable option rows by coordinate
  const rows=await page.evaluate(()=>Array.from(document.querySelectorAll('.q-item,[role=option],label')).filter(e=>{const r=e.getBoundingClientRect();return r.width>50&&r.height>10&&r.bottom>0&&r.top<844;}).map(e=>{const r=e.getBoundingClientRect();return{t:(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,30),x:r.x+r.width/2,y:r.y+r.height/2};}));
  console.log('visible option rows:',JSON.stringify(rows.slice(0,12)));
  if(rows.length){
    const n0=apiLog.length, u0=page.url();
    await page.mouse.click(rows[0].x,rows[0].y);
    await page.waitForTimeout(3000);
    console.log('\nTICKED:',rows[0].t);
    console.log('URL before:',u0);
    console.log('URL after :',page.url());
    console.log('URL CHANGED IMMEDIATELY:', u0!==page.url());
    console.log('list requests fired:',JSON.stringify(apiLog.slice(n0).filter(a=>/work-order/i.test(a.u)).map(a=>a.m+' '+a.u.slice(0,90)+' '+a.s)));
    console.log('"Apply filters" after tick:',await page.evaluate(()=>/apply\s*filters/i.test(document.body.innerText)));
    console.log('sheet still open:',await page.evaluate(()=>!!document.querySelector('[data-test-id=mobile_filter_sheet_close]')));
  }
  await page.screenshot({path:'/tmp/efa/ev-8875-sheet.png'});
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});

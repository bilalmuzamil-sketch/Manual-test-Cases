const {boot}=require('./bootF.cjs');
(async()=>{
  const {page,apiLog}=await boot({ctx:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3}});
  await page.waitForTimeout(5000);
  await page.click('[data-test-id=filter_chip_status]');
  await page.waitForTimeout(2500);
  const info=await page.evaluate(()=>{
    const dlg=[...document.querySelectorAll('div')].filter(d=>/Clear Selection/.test(d.innerText||'')&&d.getBoundingClientRect().width>100)
      .sort((a,b)=>a.getBoundingClientRect().height-b.getBoundingClientRect().height)[0];
    if(!dlg) return {err:'no dialog'};
    const r=dlg.getBoundingClientRect();
    const rows=[...dlg.querySelectorAll('*')].filter(e=>{const t=(e.innerText||'').trim();
        return /^(Estimate|Approved|In progress|Review|Complete|Invoiced|Paid|Declined|Imported)$/.test(t);})
      .map(e=>{const b=e.getBoundingClientRect();return{t:e.innerText.trim(),x:b.x+b.width/2,y:b.y+b.height/2,w:b.width,h:b.height};});
    return {box:{x:r.x,y:r.y,w:r.width,h:r.height},rows};
  });
  console.log('dialog box:',JSON.stringify(info.box));
  console.log('option rows:',JSON.stringify(info.rows,null,0));
  const target=(info.rows||[]).find(r=>r.x>0&&r.y>0&&r.y<844);
  if(!target){console.log('NO CLICKABLE ROW IN VIEWPORT');process.exit(0);}
  const n0=apiLog.length,u0=page.url();
  console.log('\nclicking:',target.t,'at',target.x,target.y);
  await page.mouse.click(target.x,target.y);
  await page.waitForTimeout(3000);
  console.log('URL changed immediately:',u0!==page.url(),'->',page.url());
  console.log('WO list requests:',JSON.stringify(apiLog.slice(n0).filter(a=>/work-order/i.test(a.u)).map(a=>a.u.slice(0,110))));
  const st=await page.evaluate(()=>({apply:/apply\s*filters/i.test(document.body.innerText),
     open:!!document.querySelector('[data-test-id=mobile_filter_sheet_close]'),
     txt:(document.querySelector('[data-test-id=mobile_filter_sheet_close]')?.closest('div')?.parentElement?.innerText||'').replace(/\s+/g,' ').slice(0,200)}));
  console.log('sheet still open:',st.open,'| Apply filters present:',st.apply);
  // try ticking a SECOND value = multi-select test
  const rows2=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>/^(Approved|In progress)$/.test((e.innerText||'').trim())).map(e=>{const b=e.getBoundingClientRect();return{t:e.innerText.trim(),x:b.x+b.width/2,y:b.y+b.height/2};}).filter(r=>r.x>0&&r.y>0&&r.y<844));
  if(rows2.length){ const n1=apiLog.length;
    await page.mouse.click(rows2[0].x,rows2[0].y); await page.waitForTimeout(2500);
    console.log('\nsecond tick:',rows2[0].t,'| sheet open after:',await page.evaluate(()=>!!document.querySelector('[data-test-id=mobile_filter_sheet_close]')));
    console.log('URL now:',page.url());
  }
  await page.screenshot({path:'/tmp/efa/ev-8875-final.png'});
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});

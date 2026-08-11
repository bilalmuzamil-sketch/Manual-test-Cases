const {boot}=require('./bootS.cjs');
(async()=>{
  const {page,APP}=await boot({ctx:{viewport:{width:1100,height:800}}});
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(10000);
  await page.screenshot({path:'/tmp/efa/ev-8837-1100.png'});
  const info=await page.evaluate(()=>{
    const hdr=document.querySelector('.fc-timeline-header');
    const lab=[...(hdr?hdr.querySelectorAll('*'):[])].filter(e=>e.children.length===0&&/^\d{1,2}\s?(AM|PM)$/i.test((e.textContent||'').trim()))
      .map(e=>({t:e.textContent.trim(),x:Math.round(e.getBoundingClientRect().x)})).sort((a,b)=>a.x-b.x);
    const gridLeft=(document.querySelector('.fc-timeline-body')||document.querySelector('.fc-scroller'))?.getBoundingClientRect().x;
    return {hdrLabels:lab.slice(0,8),gridLeft:Math.round(gridLeft||0),innerW:window.innerWidth};
  });
  console.log('grid left edge x=',info.gridLeft,'viewport',info.innerW);
  console.log('header labels:',info.hdrLabels.map(l=>l.t+'@'+l.x).join('  '));
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});

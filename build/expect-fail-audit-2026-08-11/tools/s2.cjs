const {boot}=require('./bootS.cjs');
(async()=>{
  const {page,APP}=await boot({});
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(9000);
  const r=await page.evaluate(()=>{
    // find horizontally scrollable grid containers
    const sc=[...document.querySelectorAll('div')].filter(d=>d.scrollWidth>d.clientWidth+50&&d.clientWidth>300)
      .map(d=>({cls:(d.className||'').toString().slice(0,60),scrollLeft:d.scrollLeft,scrollWidth:d.scrollWidth,clientWidth:d.clientWidth}));
    // time labels and their x positions
    const labels=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^\d{1,2}\s?(AM|PM)$/i.test((e.textContent||'').trim()))
      .map(e=>{const b=e.getBoundingClientRect();return{t:e.textContent.trim(),x:Math.round(b.x)};})
      .sort((a,b)=>a.x-b.x);
    return {sc,labels:labels.slice(0,14),total:labels.length};
  });
  console.log('horizontally scrollable containers:');
  r.sc.forEach(s=>console.log('   scrollLeft=',s.scrollLeft,'scrollWidth=',s.scrollWidth,'clientWidth=',s.clientWidth,'|',s.cls));
  console.log('\ntime labels left-to-right (first 14 of '+r.total+'):');
  console.log('   '+r.labels.map(l=>`${l.t}@${l.x}`).join('  '));
  const first=r.labels.filter(l=>l.x>=0)[0];
  console.log('\nLEFTMOST TIME LABEL AT OR AFTER THE VIEWPORT EDGE:', first?first.t+' at x='+first.x:'(none)');
  await page.screenshot({path:'/tmp/efa/ev-8837-dayview.png',fullPage:false});
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});

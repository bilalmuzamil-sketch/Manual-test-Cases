const {boot}=require('./bootS.cjs');
(async()=>{
  const {page,APP}=await boot({ctx:{viewport:{width:1100,height:800}}});
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(9000);
  const r=await page.evaluate(()=>{
    const sc=[...document.querySelectorAll('div')].filter(d=>d.scrollWidth>d.clientWidth+50&&d.clientWidth>300)
      .map(d=>({cls:(d.className||'').toString().slice(0,42),scrollLeft:Math.round(d.scrollLeft),max:d.scrollWidth-d.clientWidth}));
    const labels=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^\d{1,2}\s?(AM|PM)$/i.test((e.textContent||'').trim()))
      .map(e=>{const b=e.getBoundingClientRect();return{t:e.textContent.trim(),x:Math.round(b.x)};}).sort((a,b)=>a.x-b.x);
    const vis=labels.filter(l=>l.x>0&&l.x<window.innerWidth);
    return {sc,vis:vis.slice(0,10),firstVisible:vis[0]||null,day:(document.body.innerText.match(/Day/)||[])[0]};
  });
  console.log('viewport 1100 wide');
  r.sc.forEach(s=>console.log('   scrollLeft=',s.scrollLeft,'of max',s.max,'|',s.cls));
  console.log('visible time labels:',r.vis.map(l=>l.t+'@'+l.x).join('  '));
  console.log('FIRST VISIBLE HOUR:',r.firstVisible?r.firstVisible.t:'(none)');
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});

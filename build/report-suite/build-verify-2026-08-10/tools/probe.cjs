const {boot,APP}=require('/tmp/boot.cjs'); const fs=require('fs');
const R=process.argv[2], OUT=process.argv[3];
(async()=>{
  const {browser,page,apiLog}=await boot();
  await page.goto(APP+'/reports/'+R,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  const out={report:R,steps:[]};
  const rec=(k,v)=>{out.steps.push({k,v});console.log(k,'=>',JSON.stringify(v===undefined?null:v).slice(0,1400));};
  const click=async id=>{const l=page.locator(`[data-test-id="${id}"]`).first();if(!await l.count())return false;await l.click({force:true,timeout:6000});await page.waitForTimeout(1800);return true;};
  const texts=async ids=>page.evaluate(list=>Object.fromEntries(list.map(i=>{const e=document.querySelector(`[data-test-id="${i}"]`);return [i, e?{txt:e.innerText.trim(),aria:e.getAttribute('aria-label'),title:e.getAttribute('title'),cls:e.className}:null];})),ids);
  out.click=click; // not serialised
  // ---- task list injected by caller
  const TASKS=JSON.parse(fs.readFileSync('/tmp/tasks.json','utf8'));
  for(const t of TASKS){
    try{
      if(t.type==='click'){ rec('click:'+t.id, await click(t.id)); }
      else if(t.type==='texts'){ rec('texts', await texts(t.ids)); }
      else if(t.type==='eval'){ rec(t.name, await page.evaluate('('+t.fn+')()')); }
      else if(t.type==='wait'){ await page.waitForTimeout(t.ms); }
      else if(t.type==='esc'){ await page.keyboard.press('Escape'); await page.waitForTimeout(700); }
      else if(t.type==='shot'){ await page.screenshot({path:'/tmp/'+t.name+'.png'}); rec('shot',t.name); }
    }catch(e){ rec('ERR:'+(t.id||t.name||t.type), e.message.split('\n')[0].slice(0,120)); }
  }
  out.api=apiLog.filter(x=>/reporting/.test(x.u)).map(x=>x.u+' -> '+x.s);
  delete out.click;
  fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  await browser.close(); console.log('PROBE-DONE');
})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});

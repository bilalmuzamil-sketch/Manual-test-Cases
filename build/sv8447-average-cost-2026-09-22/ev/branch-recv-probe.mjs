import {boot} from '/tmp/sv9940/boot.mjs';
const {b,p}=await boot('/parts/orders',{width:2200,height:1200});
// find the Receive link on the I9940-1392 row
const info=await p.evaluate(()=>{
  const trs=[...document.querySelectorAll('tr')];
  for(const tr of trs){
    if(tr.innerText.includes('I9940-1392')){
      const a=[...tr.querySelectorAll('a')].map(x=>({t:x.innerText.trim(),href:x.getAttribute('href')}));
      return {row:tr.innerText.replace(/\n/g,' | ').slice(0,180), links:a};
    }
  } return null;});
console.log('ROW:', JSON.stringify(info));
if(info && info.links.length){
  const href=(info.links.find(l=>/receive/i.test(l.t))||info.links[0]).href;
  console.log('NAV ->', href);
  await p.goto('https://sv9940.qa.shopview.com'+href,{waitUntil:'domcontentloaded',timeout:90000});
  await p.waitForTimeout(11000);
  console.log('URL:', p.url());
  const f=await p.evaluate(()=>{
    const ins=[...document.querySelectorAll('input')].filter(i=>i.getAttribute('data-test-id'))
      .map(i=>({id:i.getAttribute('data-test-id'),type:i.type,value:i.value}));
    const bts=[...document.querySelectorAll('button[data-test-id]')].map(x=>x.getAttribute('data-test-id'));
    const txt=document.body.innerText.slice(0,700);
    return {ins,bts,txt};});
  console.log('INPUTS:'); f.ins.forEach(i=>console.log('   ',JSON.stringify(i)));
  console.log('BUTTONS:',JSON.stringify(f.bts.slice(0,25)));
  console.log('PAGE TEXT:\n',f.txt);
  await p.screenshot({path:'/tmp/sv8447/branch-receive.png'});
}
await b.close();

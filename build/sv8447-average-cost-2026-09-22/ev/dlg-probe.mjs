import {boot} from '/tmp/prod9940/boot.mjs';
const ID='0085fddf-7299-49aa-b2f4-c40c98fbce71';
const {b,p}=await boot('/parts/inventory',{width:2560,height:1200});
const h=await p.$(`[data-test-id="button_part_history_${ID}"]`); const hb=await h.boundingBox();
await p.mouse.click(hb.x+260, hb.y+hb.height/2); await p.waitForTimeout(6000);
const ctrls=await p.evaluate(()=>{
  const out={inputs:[],toggles:[],buttons:[]};
  document.querySelectorAll('input').forEach(i=>{const t=i.getAttribute('data-test-id');
    if(t) out.inputs.push({id:t,type:i.type,value:i.value,checked:i.checked, aria:i.getAttribute('aria-checked')});});
  document.querySelectorAll('[role=checkbox],[role=switch],.q-toggle,.q-checkbox').forEach(e=>
    out.toggles.push({id:e.getAttribute('data-test-id'),aria:e.getAttribute('aria-checked'),txt:e.innerText.trim().slice(0,40)}));
  document.querySelectorAll('button[data-test-id]').forEach(e=>out.buttons.push(e.getAttribute('data-test-id')));
  return out;});
console.log('INPUTS:'); ctrls.inputs.forEach(i=>console.log('  ',JSON.stringify(i)));
console.log('TOGGLES:'); ctrls.toggles.forEach(t=>console.log('  ',JSON.stringify(t)));
console.log('BUTTONS:', JSON.stringify(ctrls.buttons));
await p.screenshot({path:'/tmp/sv8447/dlg.png'});
await b.close();

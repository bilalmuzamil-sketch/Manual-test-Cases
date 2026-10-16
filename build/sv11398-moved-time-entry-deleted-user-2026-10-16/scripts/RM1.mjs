import {start,labor,apiTasks,moveEntry,shot,J} from './drv.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json')); const s=await start(); const out={};
out.before={screen:await labor(s,W.wid),api:await apiTasks(s,W.wid)}; await shot(s,'ev/m1-0-before-move.png');
out.move1=await moveEntry(s,W.wid,{who:'Admin ShopView',toText:'2 Replace',cap:async n=>shot(s,`ev/m1-${n}.png`)});
out.after1={screen:await labor(s,W.wid),api:await apiTasks(s,W.wid)}; await shot(s,'ev/m1-1-after-move-reload.png');
out.move2=await moveEntry(s,W.wid,{who:'Admin ShopView',toText:'1 Service'});
out.after2={screen:await labor(s,W.wid),api:await apiTasks(s,W.wid)}; await shot(s,'ev/m2-after-move-back-reload.png');
fs.writeFileSync('ev/m1m2.json',JSON.stringify(out,null,1)); console.log(J(out,4000)); await s.close();

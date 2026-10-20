// Screenshot + exact element boxes (CSS px * dpr) for annotation.
import fs from 'fs';
export async function shot(p, path, marks={}, dpr=2){
  const out={};
  for(const [k,loc] of Object.entries(marks)){ try{ const l=loc.first(); if(await l.count()){ const b=await l.boundingBox(); if(b) out[k]=[b.x*dpr,b.y*dpr,(b.x+b.width)*dpr,(b.y+b.height)*dpr]; } }catch(e){} }
  await p.screenshot({path}); fs.writeFileSync(path.replace(/\.png$/,'.json'),JSON.stringify(out,null,1)); 
  const miss=Object.keys(marks).filter(k=>!out[k]); if(miss.length) console.log('MISSING MARKS',path,miss.join(','));
  return out;
}

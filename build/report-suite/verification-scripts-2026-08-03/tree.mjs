import { readFileSync, writeFileSync } from 'fs';
const sections = JSON.parse(readFileSync('sections.json','utf8'));
const cases = JSON.parse(readFileSync('cases-all.json','utf8'));
const byId = new Map(sections.map(s=>[s.id,s]));
function ancestors(id){ const out=[]; let s=byId.get(id); while(s){ out.push(s.id); s = s.parent_id? byId.get(s.parent_id):null; } return out; }
const ROOT = 4281;
const inGroup = new Set(sections.filter(s=>ancestors(s.id).includes(ROOT)).map(s=>s.id));
console.log('sections under 4281:', inGroup.size);
const rsCases = cases.filter(c=>inGroup.has(c.section_id));
console.log('cases under 4281 (all authors):', rsCases.length);
const byAuthor = {};
for(const c of rsCases){ byAuthor[c.created_by]=(byAuthor[c.created_by]||0)+1; }
console.log('created_by counts:', JSON.stringify(byAuthor));
const foreign = rsCases.filter(c=>c.created_by!==3);
console.log('FOREIGN:', foreign.map(c=>`C${c.id} (by ${c.created_by})`).join(', '));
const ours = rsCases.filter(c=>c.created_by===3);
console.log('OURS:', ours.length);
writeFileSync('rs-ours.json', JSON.stringify(ours,null,1));
writeFileSync('rs-foreign.json', JSON.stringify(foreign,null,1));
writeFileSync('rs-sections.json', JSON.stringify(sections.filter(s=>inGroup.has(s.id)),null,1));

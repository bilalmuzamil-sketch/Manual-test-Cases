import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); const R=JSON.parse(fs.readFileSync('ids.json')); const L={};
const api=async(u,m='GET',b)=>{const r=await s.api(u,m==='GET'?null:{method:m,headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(b)}); return r;};
const P={acme:{type:'customer',id:'01a1117d-a1a9-7116-bca1-f99a603edc44'},bob:{type:'customer',id:'01a1117e-19ff-73b5-8898-33a0655d9a06'},carol:{type:'customer',id:'01a1117d-cffc-730a-adb0-208287e0e95d'}};
const CAT={supplies:'01a1107a-df57-739d-b551-d93b26c87f4e',ins:'01a1107a-df5d-73a4-b7c1-540c015c9081',wages:'01a1107a-df59-7379-88d9-f25ebaf5929d'};
const get=async x=>(await api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=20')).json.bank_transactions.find(t=>t.id===R.rows[x]);
const show=t=>({party:t.party?.name||null,summary:t.party_summary&&{kind:t.party_summary.kind,src:t.party_summary.source,sug:t.party_summary.suggested},cat:t.category_account_name,splits:(t.splits||[]).map(sp=>({id:sp.id,amt:sp.amount,party:sp.party?.name||null,summary:sp.party_summary&&{kind:sp.party_summary.kind,src:sp.party_summary.source}}))});
const partyRule=async(x,who)=>{ const r=await api('/api/accounting/bank-transaction-rules','POST',{name:`ZZAUTOTEST SV-10902 ${x} set ${who}`,priority:100,match_mode:'contains',match_pattern:`ZZ10902-${x} `,is_active:true,auto_add:false,party_action:'set',set_party:P[who]});
  const id=r.json?.bank_transaction_rule?.id; const a=await api(`/api/accounting/bank-transaction-rules/${id}/apply`,'POST',{}); const d=await api(`/api/accounting/bank-transaction-rules/${id}`,'DELETE',{}); return `rule ${r.status} apply ${a.status} ${JSON.stringify(a.json?.result||a.json).slice(0,120)} del ${d.status}`; };
const split=async(x,lines)=>{ const t=await get(x); const r=await api(`/api/accounting/bank-transactions/${t.id}/splits`,'POST',{mutation_version:t.mutation_version,splits:lines}); return `splits ${r.status} ${r.status>299?JSON.stringify(r.json).slice(0,200):''}`; };
const assign=async(x,as)=>{ const t=await get(x); const r=await api(`/api/accounting/bank-transactions/${t.id}/party-assignment`,'PUT',{mutation_version:t.mutation_version,assignments:as(t)}); return `assign ${r.status} ${r.status>299?JSON.stringify(r.json).slice(0,200):''}`; };
const two=[{account_id:CAT.supplies,amount:'60.00'},{account_id:CAT.ins,amount:'40.00'}];
const log=(x,m)=>{(L[x]=L[x]||[]).push(m); console.log(x,m);};
// A: rule Acme -> split -> rule Bob -> add 3rd line untouched
log('A',await partyRule('A','acme')); log('A',await split('A',two)); log('A',JSON.stringify(show(await get('A'))));
log('A',await partyRule('A','bob')); { const t=await get('A'); log('A',await split('A',[{id:t.splits[0].id,account_id:CAT.supplies,amount:'50.00'},{id:t.splits[1].id,account_id:CAT.ins,amount:'30.00'},{account_id:CAT.wages,amount:'20.00'}])); }
// B: agree
log('B',await partyRule('B','acme')); log('B',await split('B',two)); log('B',await partyRule('B','bob'));
// C: manual disagree
log('C',await assign('C',t=>[{split_id:null,party:P.acme}])); log('C',await split('C',two)); log('C',await assign('C',t=>[{split_id:t.splits[0].id,party:P.bob},{split_id:t.splits[1].id,party:P.carol}]));
// D: manual agree
log('D',await assign('D',t=>[{split_id:null,party:P.acme}])); log('D',await split('D',two)); log('D',await assign('D',t=>[{split_id:t.splits[0].id,party:P.bob},{split_id:t.splits[1].id,party:P.bob}]));
// E: rule Acme -> split -> rule Bob  (cleared on screen later)
log('E',await partyRule('E','acme')); log('E',await split('E',two)); log('E',await partyRule('E','bob'));
// F: rule Acme -> split only
log('F',await partyRule('F','acme')); log('F',await split('F',two));
const st={}; for(const x of 'ABCDEF') st[x]=show(await get(x));
fs.writeFileSync('state-before-collapse.json',JSON.stringify(st,null,1)); fs.writeFileSync('setup-log.json',JSON.stringify(L,null,1));
for(const x of 'ABCDEF') console.log('STATE',x,JSON.stringify(st[x]));
await s.close();

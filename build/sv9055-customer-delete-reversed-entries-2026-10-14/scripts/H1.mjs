import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs';
const s=await ob(); await loc(s);
for (const [t,acc] of [['A3 (deleted)','f96f13ca-a994-466b-9c5f-758a845b68c3'],['X1 (deleted)','d49d1ad3-0672-4faf-9e70-9a772397b369']]){
  const d=await s.api('/api/customer-deposits/list?accountId='+acc); console.log(t,d.status,J((d.json?.data?.collection||[]).map(x=>[x.creditNumber,x.amount,x.status,x.reversedAt]),300), J(d.json?.errors,150));
}
await s.close();

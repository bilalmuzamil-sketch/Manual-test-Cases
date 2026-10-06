var tagEnd=function(s,start,tag){tag=tag||(s.slice(start).match(/^<([a-z]+)/)||[])[1];const re=new RegExp('<'+tag+'\\b|</'+tag+'>','g');re.lastIndex=start;let d=0,m;while((m=re.exec(s))){if(m[0][1]==='/'){d--;if(d===0)return re.lastIndex}else d++}return -1};
var rng=function(t,id,from){const i=t.indexOf('<div id="'+id+'"',from||0);if(i<0)return null;return [i,tagEnd(t,i,'div')]};
var tx=function(s){return s.replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<[^>]+>/g,'|').replace(/\|[\s|]*/g,'|')};
var elAt=function(s,idx){let a=s.lastIndexOf('<',idx);while(a>=0&&(s[a+1]==='/'||!/^<(div|span|a|label|button)\b/.test(s.slice(a))))a=s.lastIndexOf('<',a-1);return [a,tagEnd(s,a)]};
var enclosing=function(s,idx,test){let a=idx;while(true){a=s.lastIndexOf('<',a-1);if(a<0)return null;if(s[a+1]==='/')continue;const m=s.slice(a).match(/^<(div|span|a|label|button)\b/);if(!m)continue;const e=tagEnd(s,a,m[1]);if(e>idx&&test(s.slice(a,e)))return [a,e]}};
var edit=function(t,id,fn,from){const r=rng(t,id,from);if(!r)throw 'no '+id;return t.slice(0,r[0])+fn(t.slice(r[0],r[1]))+t.slice(r[1])};
var bal=function(t){const b=t.slice(t.indexOf('</helmet>'),t.indexOf('</x-dc>'));return (b.match(/<div\b/g)||[]).length-(b.match(/<\/div>/g)||[]).length};
var rep=function(s,a,b){return s.split(a).join(b)};

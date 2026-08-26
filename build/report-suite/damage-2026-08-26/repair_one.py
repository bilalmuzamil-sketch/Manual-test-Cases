import json, html, re, hashlib
import tr
CID='30197'
s,live=tr.call(f'get_case/{CID}')
assert s==200 and live['custom_atmstatus']!=3, (s,live.get('custom_atmstatus'))
cur=live['custom_expected']
json.dump(live,open('C30197-before.json','w'),indent=1)
clean=cur.strip()
assert clean.startswith('<p>') and clean.endswith('</p>')
clean=clean[3:-4].replace('<br>','\n')
clean=html.unescape(clean)
print('INTENDED CLEAN:',repr(clean)[:300])
s,_=tr.call(f'update_case/{CID}',{'custom_expected':clean})
s2,aft=tr.call(f'get_case/{CID}')
got=aft['custom_expected']
json.dump(aft,open('C30197-after.json','w'),indent=1)
print('PUT HTTP',s,'GET HTTP',s2)
print('STORED:',repr(got)[:400])
print('byte-match with intended clean:',got==clean)
print('still has literal <p>:','<p>' in got)

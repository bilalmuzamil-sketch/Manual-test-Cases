#!/usr/bin/env python3
"""Put the CURRENT screenshot on each of the six reports that no longer reproduce, as a comment that
says QA Status Passed.

The status itself is NOT changed - the QA lead marks these passed himself, when he says so. This only
puts the evidence where he can see it.

The picture goes in through wiki markup on API v2, which is the only route that embeds an image in a
comment; the MCP tools take markdown and would leave it as a file nobody opens.
"""
import json, subprocess, sys
REPO='/home/user/Manual-test-Cases'
D=f'{REPO}/build/global-search/tickets-2026-09-14'
COOK='/tmp/atlassian/cookies.txt'

def sh(a): return subprocess.run(a,capture_output=True,text=True).stdout

def attach(key,path,name):
    out=sh(['curl','-s','-w','\n__HTTP:%{http_code}','-b',COOK,'--cacert','/root/.ccr/ca-bundle.crt',
      '-H','Accept: application/json','-H','X-Atlassian-Token: no-check',
      '-H','Origin: https://shopview.atlassian.net','-H','Referer: https://shopview.atlassian.net/browse/'+key,
      '-H','User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
      '-F', f'file=@{path};filename={name}',
      f'https://shopview.atlassian.net/rest/api/3/issue/{key}/attachments'])
    return '__HTTP:200' in out

def comment(key,body):
    p=f'/tmp/{key}-qa.json'; json.dump({'body':body},open(p,'w'))
    out=sh(['bash',f'{REPO}/build/atlassian-login/jira.sh','POST',f'/rest/api/2/issue/{key}/comment',p])
    return '__HTTP:201' in out, out[-90:]

WHAT = {
 'SV-10014': ('the chassis number typed again on 15 September',
   'Assets says 1 along the top, and clicking Assets lists the vehicle - 2016 Ram 2500, 4 Star Truck Repair. The count and the section agree.'),
 'SV-10015': ('the supplier contact email typed again on 15 September',
   'Vendors says 1 along the top, and clicking Vendors lists the supplier - Carolina Truck & Trailer Repair. The count and the section agree. The address the report names is gone from this branch, so the one the supplier holds today was used.'),
 'SV-10016': ('the part number typed again on 15 September',
   'Parts says 1 along the top, and clicking Parts lists the part - ZZAUTOTEST Brake Chamber Kestrel, 25 available. The count and the section agree.'),
 'SV-10017': ('part of a job number typed again on 15 September',
   'Work orders says 1 along the top, and clicking Work orders lists the job - S9160-17615, A & J Truck & Trailer Repair. The count and the section agree. The job the report names no longer exists on this branch, so a job that does was used.'),
 'SV-10056': ('a brand new job searched by its number on 15 September',
   'The job came back after ten seconds, inside the thirty asked for. Three separate new jobs were timed and every one came back after ten seconds. The version people use today takes about eleven seconds for the same thing, so nothing was lost against it either.'),
 'SV-10059': ('the search box after a search that matched nothing, on 15 September',
   'Clearing the box brings the recently viewed list straight back - the same 34 items, under the heading Recent searches.'),
}
NOW = {'SV-10014':'fixed-shots/SV-10014-now.png','SV-10015':'fixed-shots/SV-10015-now.png',
       'SV-10016':'fixed-shots/SV-10016-now.png','SV-10017':'fixed-shots/SV-10017-now.png',
       'SV-10056':'fixed-shots/SV-10056-v2.png','SV-10059':'fixed-shots/SV-10059-now.png'}

for key,(cap,says) in WHAT.items():
    name=f'{key}-checked-15-September.png'
    ok=attach(key, f'{D}/{NOW[key]}', name)
    body = ('h2. QA Status Passed\n\n'
            f'Re-checked on the test branch sv9160, build v26.36.4-7869ff2, on 15 September 2026.\n\n'
            f'{says}\n\n'
            f'!{name}|width=655!\n\n'
            f'_{cap}._\n\n'
            'The report itself has been left open and rewritten so it still reads correctly, and the '
            'test that covers it stays in the run - it is worth running again on the next build. '
            'Moving the status is the QA lead\'s to do.')
    okc,why=comment(key,body)
    print(f'{key}  picture attached: {ok}  comment posted: {okc}  {"" if okc else why}')

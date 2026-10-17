s=open('comment-78911-orig.txt').read()
T='17 October 2026, 05:25 CDT'
def rep(a,b):
    global s
    assert a in s, a[:60]; s=s.replace(a,b)
rep("""{panel:bgColor=#e3fcef|borderColor=#00875a}
*OVERALL QA STATUS: PASSED*
{panel}
Tested on Staging (build v26.40.19-754919e) on 16 October 2026, against the spec (version 64). 6 of 6 checks passed.""",
f"""{{panel:bgColor=#fffae6}}
*OVERALL QA STATUS: PARTIALLY PASSED*
{{panel}}
_First posted 16 October 2026, 16:29 CDT. Edited on {T}: the verdict changed from PASSED to partially passed because the *Paid* pill in Tech View is narrower than in List (check 5); the screen recording's size was also corrected._

The details of what passed are below. The one thing still to be fixed is posted in a separate comment below this one.

Tested on Staging (build v26.40.19-754919e) on 16 and 17 October 2026, against the spec (version 64). 5 of 6 checks passed; check 5 failed for the *Paid* status only.""")
rep("The Tech View status pill now changes height with density: 16 px at Compact and Regular, 22 px at Comfortable. It keeps the List's width and its red and blue counts, and the List's own pill is unchanged.",
"The Tech View status pill now changes height with density: 16 px at Compact and Regular, 22 px at Comfortable. It keeps the List's red and blue counts, and the List's own pill is unchanged. It keeps the List's width for every status except *Paid*, which is 44.5 px in Tech View and 58.5 px in List.")
rep("""|5|The pill is as wide as the List's pill for the same work orders (113.98 px for the 12 pills of search S2-363, and for S2-33351).|PASSED|""",
f"""|5|The pill is as wide as the List's pill for the same work orders: the same for Estimate, Approved, In Progress, Ready For Review, Complete, Invoiced and Declined (for example 113.98 px for the 12 pills of search S2-363, and for S2-33351). *Paid* is not: Tech View 44.5 px, List 58.5 px (Staging and Production), checked with the Status filter set to Paid. _Updated on {T}: was PASSED; my first check did not include a Paid work order._|FAILED|

!sv11318-02-paid-width.png|width=1024,height=534!
_Added on {T}. Status filter set to Paid. Production List: Paid pill 58.5 px. Staging List: 58.5 px. Staging Tech View: 44.5 px. Staging Board View card: 44.5 px. The Invoiced pill, checked the same way, is 64.2 px everywhere._""")
rep('|width=1280,alt="sv11318-tech-view-pill-density-staging-recording-voiceover.mp4"!','|width=1280,height=800,alt="sv11318-tech-view-pill-density-staging-recording-voiceover.mp4"!')
rep("window 1440 px, zoom 100%: work order S2-33351","window 1440 x 900 px, zoom 100%: work order S2-33351")
open('comment.txt','w').write(s)

#!/usr/bin/env python3
"""
Generate the LIVE-VERIFIED prod-vs-staging permission deliverable (2026-07-15).

TRUST-CRITICAL rebuild. Rule 12: only LIVE-OBSERVED cells (screenshot captured this
run) get a verdict; everything else is explicitly NOT VERIFIED with a reason. NO
inference. Prod was NOT observable this run (session expired 409 at run start) so
EVERY prod cell = NOT VERIFIED and NO row can carry a dual (prod-vs-staging) verdict.
"""
import json, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

BASE='/home/user/Manual-test-Cases/build/custom-roles-run'
STG_DIR=f'{BASE}/live-ui-2026-07-15/staging'
cons=json.load(open('/tmp/custom-roles/consolidated-staging.json'))
by_role={r['role']:r for r in cons}

ROLE_ORDER=['Admin','Service Manager','Senior Service Advisor','Parts Manager','Service Advisor',
            'Foreman','Office User','Parts Technician','Sales Representative','Technician','Time Clock User']
# staging role -> production legacy role(s) mapped (QA-lead confirmed mapping)
PROD_MAP={
 'Admin':'Administrator','Service Manager':'Service Manager',
 'Senior Service Advisor':'Service Advisor + SA Technician + SA No Reports (merge)',
 'Parts Manager':'Parts Manager','Service Advisor':'SA Limited View',
 'Foreman':'Foreman','Office User':'Office','Parts Technician':'Parts Technician',
 'Sales Representative':'Sales Representative + Reporting (merge)','Technician':'Technician',
 'Time Clock User':'Time Clock'}

def shot(role, name):
    p=f'{STG_DIR}/{role.replace(" ","_").replace("/","_")}/{name}'
    return p if os.path.exists(p) else ''

# Capabilities: (label, staging-source-key or None, staging_method, notes)
# staging_key None => NOT VERIFIED on staging this run (couldn't reach live)
CAPS=[
 ('Send to Portal (WO action button)','sendToPortal','LIVE-OBSERVED (aria-label "Send to Portal" icon on ready_for_review WO S9-25044; full-page screenshot)'),
 ('See Financial Data on WO (Rate/Margin columns)','rateMargin','LIVE-OBSERVED (Rate + Margin columns rendered on WO lines)'),
 ('Create/Edit WO Lines ("New Line" button)','newLine','LIVE-OBSERVED ("New Line" button on WO detail)'),
 ('Review Work Orders ("Reviewed" button)','reviewed','LIVE-OBSERVED ("Reviewed" button on ready_for_review WO)'),
 ('WO line actions menu (line / bulk "⋮")','lineBulk','LIVE-OBSERVED (aria-label "Line bulk action" ⋮ on WO lines)'),
 ('Finance tab visible on WO','financeTab','LIVE-OBSERVED (Finance tab in WO tab bar)'),
 ('Send to Terminal (take payment in payment dialog)',None,'NOT VERIFIED — payment/Finance dialog not reachable live this session (cold-load of invoiced WO redirected to list). Prior "no control in build" was a source-grep, not an observation — treated as unverified.'),
 ('Remove a WO part',None,'NOT VERIFIED — line-level "⋮" submenu not opened per-role this run.'),
 ('Delete Work Order',None,'NOT VERIFIED — sits in the top "⋮" menu; not opened systematically per-role this run (only incidentally seen for Admin).'),
 ('Delete WO Line',None,'NOT VERIFIED — line "⋮" submenu not opened per-role this run.'),
 ('Order Parts (WO Parts tab)',None,'NOT VERIFIED — Parts tab action not driven live this run.'),
 ('Approve/Complete a part return',None,'NOT VERIFIED — return flow not driven live this run.'),
 ('Delete / Reverse an invoice',None,'NOT VERIFIED — invoicing delete/reverse not driven live this run.'),
 ('See AP/AR data',None,'NOT VERIFIED — Accounts Payable/Receivable surface not navigated live this run.'),
]

wb=Workbook()
H=Font(bold=True,color='FFFFFF'); HF=PatternFill('solid',fgColor='2F5496')
WR=Font(bold=True,color='FFFFFF'); WF=PatternFill('solid',fgColor='C00000')  # red banner
OK=PatternFill('solid',fgColor='C6EFCE'); NV=PatternFill('solid',fgColor='FFC7CE'); NVF=Font(color='9C0006')
YEL=PatternFill('solid',fgColor='FFF2CC')
thin=Side(style='thin',color='BFBFBF'); BD=Border(thin,thin,thin,thin)
wrap=Alignment(wrap_text=True,vertical='top')

# ---- Tab 0: READ ME ----
ws=wb.active; ws.title='READ ME - Coverage & Honesty'
ws.column_dimensions['A'].width=120
rows=[
 ('LIVE-VERIFIED Prod-vs-Staging Permission Check — 2026-07-15 (TRUST-CRITICAL REBUILD)','banner'),
 ('',''),
 ('WHY THIS FILE EXISTS: the prior deliverable (Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx) presented several FE-gated','h'),
 ('capabilities (Send to Portal/Terminal etc.) as results that were INFERRED from role definitions / source code, not observed','n'),
 ('live in the UI. That is now marked SUPERSEDED. This file is rebuilt observed-only (Standing Rules 10 & 12).','n'),
 ('',''),
 ('RULE APPLIED: a cell is only "LIVE-OBSERVED" if the control was rendered on the real screen this run with a screenshot','h'),
 ('captured. Everything else is explicitly "NOT VERIFIED" with the reason. NOTHING is inferred from role definitions,','n'),
 ('fe_permissions arrays, atoms, or source code.','n'),
 ('',''),
 ('PRODUCTION WAS NOT OBSERVABLE THIS RUN.','banner'),
 ('The production session (PHPSESSID) returned 409 "Session has expired" on EVERY endpoint at the very start of the run','h'),
 ('(before any observation). Per the task stop-condition, production was STOPPED and NOTHING about prod was inferred.','n'),
 ('CONSEQUENCE: every production cell = NOT VERIFIED, and therefore NO row can carry a real prod-vs-staging verdict.','n'),
 ('A fresh production cookie is required to complete the comparison.','n'),
 ('',''),
 ('WHAT WAS GENUINELY OBSERVED (staging, LIVE): staging session was alive the whole run. All 11 staging system roles were','h'),
 ('rendered in the real SPA via genuine impersonation — switch-user for 7 roles that had an active user, and tech role-swap','n'),
 ('(assign real role -> quick-login tech -> observe -> restore Technician) for the 4 roles with no active user. For each role','n'),
 ('the WO-detail controls were observed on-screen and a full-page screenshot captured.','n'),
 ('',''),
 ('KEY LIVE FINDING (corrects the prior inference): Foreman SHOWS "Send to Portal" live even though its role lacks the','h'),
 ('customerPortalPageAccess atom. The prior run INFERRED Foreman hides it (gate = customerPortalPageAccess). Live, the','n'),
 ('Send-to-Portal icon renders for all 6 roles that can review WOs (Admin, Service Manager, Senior Service Advisor, Parts','n'),
 ('Manager, Service Advisor, Foreman) and is absent for the 5 that cannot (Office User, Parts Technician, Sales Rep,','n'),
 ('Technician [tech view], Time Clock User). The real gate tracks review capability, not the portal-page atom.','n'),
 ('',''),
 ('COVERAGE (capability x role x env cells):','h'),
]
for r,style in rows:
    c=ws.append([r]) or ws.cell(ws.max_row,1)
    cell=ws.cell(ws.max_row,1)
    if style=='banner': cell.font=WR; cell.fill=WF
    elif style=='h': cell.font=Font(bold=True)
# coverage numbers
n_roles=len(ROLE_ORDER)
live_caps=[c for c in CAPS if c[1]]
nv_caps=[c for c in CAPS if not c[1]]
stg_live=len(live_caps)*n_roles
stg_nv=len(nv_caps)*n_roles
prod_total=len(CAPS)*n_roles
total_cells=len(CAPS)*n_roles*2
observed=stg_live
cov=[
 f'  Total cells (capabilities {len(CAPS)} x roles {n_roles} x envs 2) = {total_cells}',
 f'  STAGING observed LIVE           = {stg_live}  ({len(live_caps)} caps x {n_roles} roles)',
 f'  STAGING NOT VERIFIED            = {stg_nv}  ({len(nv_caps)} caps x {n_roles} roles)',
 f'  PRODUCTION observed LIVE        = 0   (session expired 409 at run start)',
 f'  PRODUCTION NOT VERIFIED         = {prod_total}',
 f'  Cells with a DUAL (prod+staging) verdict = 0   (prod not observed)',
 f'  Overall observed-live fraction  = {observed}/{total_cells} = {observed/total_cells*100:.0f}%',
]
for r in cov: ws.cell(ws.append([r]) or ws.max_row,1).font=Font(name='Consolas')
ws.append([''])
ws.cell(ws.append(['CLEANUP: all switch-user impersonations exited (exit-switch-user 200); tech user restored to Technician '
                   '(role 10fdbeaa..., 6 perms) and verified; no throwaway data created; production left untouched (no writes '
                   'possible - session dead).']) or ws.max_row,1).font=Font(bold=True)

# ---- Tab 1: Live Compare (main) ----
ws=wb.create_sheet('Live Compare (role x cap)')
hdr=['Staging Role','Production role(s) mapped','Capability','PROD observed state','Staging observed state',
     'Staging screenshot','Direction','Per-spec Yes/No','Method','Confidence / source']
ws.append(hdr)
for i,h in enumerate(hdr,1):
    c=ws.cell(1,i); c.font=H; c.fill=HF; c.alignment=wrap; c.border=BD
widths=[20,34,40,26,40,52,20,14,40,54]
for i,w in enumerate(widths,1): ws.column_dimensions[chr(64+i) if i<=26 else 'A'].width=w
for role in ROLE_ORDER:
    d=by_role[role]
    for label,key,method in CAPS:
        if key is not None:
            val=d.get(key)
            stg_state=('SHOWN / present' if val else 'HIDDEN / absent')+' (live)'
            sc=shot(role,'WO_ready_for_review.png')
            conf='STAGING = OBSERVED-LIVE.  PROD = NOT VERIFIED (session expired 409).'
            meth=d['mode']+ (' impersonation' if d['mode']=='su' else ' (quick-login '+ ('tech role-swap' if role not in ['Admin','Technician'] else role.lower())+')')
        else:
            stg_state='NOT VERIFIED'
            sc=''
            conf='NOT VERIFIED both sides. Staging: '+method.split('—')[1].strip() if '—' in method else 'NOT VERIFIED'
            meth='not driven live'
        row=[role,PROD_MAP[role],label,'NOT VERIFIED (prod session expired 409)',stg_state,sc,
             'NOT VERIFIED (prod not observed)','NOT VERIFIED','staging: '+meth,conf]
        ws.append(row)
        r=ws.max_row
        for i in range(1,len(hdr)+1):
            cell=ws.cell(r,i); cell.alignment=wrap; cell.border=BD
        # colour staging-state + prod cells
        ws.cell(r,4).fill=NV; ws.cell(r,4).font=NVF
        if key is not None:
            ws.cell(r,5).fill=OK if d.get(key) else YEL
        else:
            ws.cell(r,5).fill=NV; ws.cell(r,5).font=NVF
        ws.cell(r,7).fill=NV; ws.cell(r,8).fill=NV

# ---- Tab 2: Staging Live Grid ----
ws=wb.create_sheet('Staging Live Grid')
grid_hdr=['Staging Role','Perms','View mode','Send to Portal','See Fin Data (Rate/Margin)','New Line (WO Lines C&E)',
          'Reviewed (Review WO)','Line ⋮ menu','Finance tab','Method','WO screenshot']
ws.append(grid_hdr)
for i,h in enumerate(grid_hdr,1):
    c=ws.cell(1,i); c.font=H; c.fill=HF; c.alignment=wrap; c.border=BD
gw=[20,7,10,14,20,20,18,12,12,34,50]
for i,w in enumerate(gw,1):
    col=ws.cell(1,i).column_letter; ws.column_dimensions[col].width=w
def yn(v): return 'SHOWN' if v else 'hidden'
for role in ROLE_ORDER:
    d=by_role[role]
    meth = 'switch-user impersonation' if d['mode']=='su' else ('quick-login (Admin)' if role=='Admin' else ('quick-login tech' if role=='Technician' else 'tech role-swap + quick-login'))
    ws.append([role,d['perms'],str(d['view']),yn(d['sendToPortal']),yn(d['rateMargin']),yn(d['newLine']),
               yn(d['reviewed']),yn(d['lineBulk']),yn(d['financeTab']),meth,shot(role,'WO_ready_for_review.png')])
    r=ws.max_row
    for i in range(1,len(grid_hdr)+1):
        cell=ws.cell(r,i); cell.alignment=wrap; cell.border=BD
    for ci,key in [(4,'sendToPortal'),(5,'rateMargin'),(6,'newLine'),(7,'reviewed'),(8,'lineBulk'),(9,'financeTab')]:
        ws.cell(r,ci).fill=OK if d[key] else YEL

# ---- Tab 3: Production NOT VERIFIED ----
ws=wb.create_sheet('Production NOT VERIFIED')
ws.column_dimensions['A'].width=110
for line,st in [
 ('PRODUCTION — NOT VERIFIED (entire environment)','banner'),
 ('',''),
 ('The supplied production cookie (PHPSESSID=cc767427...) returned HTTP 409 "Session has expired." on every endpoint','h'),
 ('probed at the start of the run:','n'),
 ('   GET /api/iam/list-roles            -> 409','c'),
 ('   GET /api/organizations/settings    -> 409 {"error":"Session has expired."}','c'),
 ('   GET /api/staff?page=1              -> 409','c'),
 ('','' ),
 ('No production screen or role could be observed. Per the task stop-condition and Standing Rule 12, production was','h'),
 ('STOPPED and nothing was inferred. The prior workbook\'s production values are NOT reused here.','n'),
 ('','' ),
 ('TO COMPLETE THE COMPARISON: supply a FRESH production cookie (prod is NO-SSO -> plain PHPSESSID; it expires fast).','h'),
 ('Then production per-role capabilities can be observed via switch-user impersonation on the old-model SPA and diffed','n'),
 ('against the staging live grid already captured in this file.','n'),
]:
    c=ws.cell(ws.append([line]) or ws.max_row,1)
    if st=='banner': c.font=WR; c.fill=WF
    elif st=='h': c.font=Font(bold=True)
    elif st=='c': c.font=Font(name='Consolas')

out=f'{BASE}/Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx'
wb.save(out)
print('WROTE', out)

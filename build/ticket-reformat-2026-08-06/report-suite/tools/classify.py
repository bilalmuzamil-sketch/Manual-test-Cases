#!/usr/bin/env python3
"""Turn the live population into the working set, and snapshot every full description.

Membership rule for the REPORT SUITE half: the ticket is ours (creator = us) AND its
parent is epic SV-8582 or one of the epic's 97 stories -- OR it has no parent but links
to the epic (that is how the two parentless Bugs SV-8821/SV-8822 belong here).
Excluded: SV-8910 (ownership unconfirmed, QA lead asked) and SV-8871 (parent SV-8795 =
a FILTERS story, so it is the sibling worker's half).
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import jiralib as J

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, '..', 'snapshots')
EPIC = 'SV-8582'
EXCLUDE = {
    'SV-8910': 'Ownership unconfirmed; the QA lead has been asked. Instructed to skip.',
    'SV-8871': 'Parent SV-8795 is a FILTERS story under epic SV-8785, not a Report Suite story. '
               'It is the sibling worker\'s half.',
}

# Every field we must prove byte-identical after each edit.
GUARD_FIELDS = ('summary,status,resolution,issuetype,parent,priority,creator,reporter,assignee,'
                'labels,issuelinks,customfield_10153,components,fixVersions,versions,duedate,'
                'timetracking,security,environment,customfield_10152,attachment,subtasks,'
                'votes,watches,worklog,project')


def main():
    pop = json.load(open(os.path.join(SNAP, 'population.json')))
    stories = set(pop['stories'])
    work, excluded = {}, {}

    for k, v in pop['ours'].items():
        if k in EXCLUDE:
            excluded[k] = dict(v, exclude_reason=EXCLUDE[k])
            continue
        par = v['parent']
        links_epic = any(l['outward'] == EPIC or l['inward'] == EPIC for l in v['links'])
        if par == EPIC or par in stories:
            v['membership'] = 'parent is the epic' if par == EPIC else f'parent is story {par}'
        elif par is None and links_epic:
            v['membership'] = 'no parent, but links to the epic'
        else:
            excluded[k] = dict(v, exclude_reason=f'parent {par} is not the epic nor one of its stories')
            continue
        work[k] = v

    # full detail + description for every member of the working set
    detail = {}
    for k in sorted(work):
        code, d = J.get(f'/rest/api/3/issue/{k}?expand=renderedFields', out=f'/tmp/_rf_{k}.json')
        if code != '200':
            raise SystemExit(f'{k}: HTTP {code}')
        detail[k] = d

    json.dump(detail, open(os.path.join(SNAP, 'live-full.json'), 'w'), indent=1)

    for k in sorted(work):
        f = detail[k]['fields']
        work[k]['description_adf'] = f.get('description')
        work[k]['rendered_html'] = detail[k].get('renderedFields', {}).get('description')
        work[k]['open'] = f['status']['statusCategory']['name'] != 'Done' and not f.get('resolution')

    out = {'epic': EPIC, 'working_set': {k: work[k] for k in sorted(work)},
           'excluded': excluded,
           'counts': {'population': len(work),
                      'open': sum(1 for v in work.values() if v['open']),
                      'closed': sum(1 for v in work.values() if not v['open']),
                      'excluded': len(excluded)}}
    json.dump(out, open(os.path.join(SNAP, 'working-set.json'), 'w'), indent=1)

    print('population (ours, Report Suite):', out['counts']['population'])
    print('  open   :', out['counts']['open'])
    print('  closed :', out['counts']['closed'])
    for k, v in work.items():
        if not v['open']:
            print('     closed:', k, v['status'], v['resolution'])
    print('excluded:', {k: v['exclude_reason'][:60] for k, v in excluded.items()})


if __name__ == '__main__':
    main()

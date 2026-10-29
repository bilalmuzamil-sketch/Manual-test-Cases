"""Worker p2a's own staging session (/tmp/cln/p2a/sess.txt, minted by mint.mjs in this folder), so other workers'
change-location calls cannot move our session time zone. SECRET-FREE: the cookie is read at run time, never printed."""
import sys
TOOLS = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools'
sys.path.insert(0, TOOLS)
import collect_dashboard
collect_dashboard.COOKIE = open('/tmp/cln/p2a/sess.txt').read().strip()
from collect_dashboard import curl, WORKPLACES  # noqa
from collect_reports import instants, get  # noqa
LOC = {'HD': ('b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'),
       'LETH': ('f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton', 'Staging Lethbridge - 4310'),
       'QB': ('25a0d576-b371-4b82-bef4-41ba977f31c2', 'America/Vancouver', 'QB Location'),
       'DVI': ('39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test')}
def use(key):
    """change-location this session to the location's own zone (Rule 99); returns (wid, tz, name, status)."""
    wid, tz, name = LOC[key]
    c, b = curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
    return wid, tz, name, c

"""Use THIS worker's own session (/tmp/cln/w1/sess-w1.txt, minted from the shared quick-login), so other
workers switching location in the shared session cannot change our session time zone mid-read.
SECRET-FREE: the cookie is read from /tmp at run time and never printed."""
import sys
TOOLS = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools'
sys.path.insert(0, TOOLS)
import collect_dashboard
collect_dashboard.COOKIE = open('/tmp/cln/w1/sess-w1.txt').read().strip()
from collect_dashboard import curl, WORKPLACES  # noqa
from collect_reports import instants, get  # noqa

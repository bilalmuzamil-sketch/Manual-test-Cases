"""As tech@shopview.com (Admin, own jar /tmp/staging-tech): read 4Refuel's unpaid bills at Heavy Duty and at Lethbridge
(POST iam/change-location, app/src/api/auth/index.ts:62), then return tech to Heavy Duty, its default. Read-only otherwise."""
import json, subprocess, sys, os
H = os.path.dirname(os.path.abspath(__file__))
CK = open('/tmp/staging-tech/cookie-header.txt').read().strip()
def post(path, body):
    o = subprocess.run(['curl', '-s', '-m', '60', '-X', 'POST', '-H', 'Cookie: ' + CK, '-H', 'Content-Type: application/json', '-H', 'Accept: application/json',
                        '-H', 'Origin: https://app.staging.shopview.com', '-d', json.dumps(body), '-w', '\n%{http_code}', 'https://api.staging.shopview.com/api/' + path], capture_output=True, text=True).stdout
    return o.rsplit('\n', 1)[1]
LOC = {'heavy-duty': ('b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi'), 'lethbridge': ('f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton')}
try:
    for label, (wid, tz) in LOC.items():
        print('switch', label, post('iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz}))
        ctl = subprocess.run(['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Origin: https://app.staging.shopview.com',
                              'https://api.staging.shopview.com/api/inventory/deliveries/4cdaa082-5aec-4d25-a9b4-44e8eb0a1013'], capture_output=True, text=True).stdout
        print('  control: Lethbridge bill E2E-INV-1791977645410 opens ->', ctl, '(200 only when the active location is Lethbridge)')
        subprocess.run([sys.executable, os.path.join(H, 'check_4refuel.py'), f'unpaid {label}', '/tmp/staging-tech/cookie-header.txt'], cwd=H, check=True)
finally:
    print('switch back to heavy-duty', post('iam/change-location', {'workplace_id': LOC['heavy-duty'][0], 'workplace_timezone': LOC['heavy-duty'][1]}))

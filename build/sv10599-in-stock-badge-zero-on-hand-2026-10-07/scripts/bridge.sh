cd /home/user/Manual-test-Cases && (nohup node build/testing-tools/staging-bridge.mjs > /tmp/qa10599/bridge.log 2>&1 &)
for i in $(seq 1 30); do grep -q BRIDGE_LISTENING /tmp/qa10599/bridge.log 2>/dev/null && break; sleep 0.5; done
P=$(grep -o 'LISTENING 127.0.0.1:[0-9]*' /tmp/qa10599/bridge.log | cut -d: -f2); echo $P > /tmp/qa10599/port.txt; echo $P > /tmp/qa10642/port.txt; echo port $P

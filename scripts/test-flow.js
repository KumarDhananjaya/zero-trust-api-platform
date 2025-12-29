/**
 * End-to-End Test Script for Zero-Trust API Platform
 * Value: Validates the entire flow from Registration -> Login -> Gateway -> Policy -> Audit.
 * Usage: node scripts/test-flow.js
 */

const GATEWAY_URL = 'http://localhost:8080';

async function run() {
    console.log('🚀 Starting E2E Trace...\n');

    // 1. Register User
    const email = `admin_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`[1] Registering User (${email})...`);
    const regRes = await fetch(`${GATEWAY_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, roles: ['admin'] }) // Requesting admin role for seeding
    });

    if (!regRes.ok) {
        console.error('❌ Registration Failed:', await regRes.text());
        return;
    }
    const regData = await regRes.json();
    console.log('✅ Registered:', regData);

    // 2. Login
    console.log(`\n[2] Logging in...`);
    const loginRes = await fetch(`${GATEWAY_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!loginRes.ok) {
        console.error('❌ Login Failed:', await loginRes.text());
        return;
    }
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log('✅ Login Successful. Token received.');

    // 3. Access Protected Resource (Policies)
    // This tests: Gateway -> AuthGuard (Validate Token) -> PolicyGuard (Check Permissions) -> Policy Engine
    console.log(`\n[3] Accessing Protected Resource (GET /policies)...`);
    const policyRes = await fetch(`${GATEWAY_URL}/policies`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (policyRes.status === 403) {
        console.error('❌ Access Denied (403). Policy Engine blocked request.');
        console.log('   (Did you seed the admin policy?)');
    } else if (policyRes.ok) {
        const policies = await policyRes.json();
        console.log('✅ Access Granted! Policies retrieved:', policies);
    } else {
        console.error('❌ Error:', policyRes.status, await policyRes.text());
    }

    // 4. Verify Audit Logs
    console.log(`\n[4] Verifying Audit Logs (GET /audit)...`);
    // Audit endpoint is also protected, likely requires 'admin' role
    const auditRes = await fetch(`${GATEWAY_URL}/audit`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (auditRes.ok) {
        const logs = await auditRes.json();
        console.log(`✅ Audit Logs Retrieved. Found ${logs.length} entries.`);
        if (logs.length > 0) {
            console.log('   Latest Log:', logs[0]);
        }
    } else {
        console.warn('⚠️ Could not fetch audit logs (Check permissions):', auditRes.status);
    }

    console.log('\n✨ E2E Trace Complete.');
}

run().catch(console.error);

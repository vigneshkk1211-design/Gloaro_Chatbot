#!/usr/bin/env node
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Pre-flight Diagnostic Script
 * Run:  node scripts/preflight.js
 *
 * Checks every known startup failure mode BEFORE launching NestJS so you
 * get a single clear error message instead of a cryptic crash log.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const net  = require('net');
const dns  = require('dns');

// ── Helpers ───────────────────────────────────────────────────────────────────
function fatal(msg) {
  console.error('\n❌ FATAL:', msg, '\n');
  process.exit(1);
}

function checkPort(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once('error', (err) => {
      tester.close(() => resolve(err.code === 'EADDRINUSE' ? 'in-use' : 'error'));
    });
    tester.once('listening', () => {
      tester.close(() => resolve('free'));
    });
    tester.listen(port, '0.0.0.0');
  });
}

function dnsLookup(host) {
  return new Promise((resolve) => {
    dns.lookup(host, (err) => resolve(err ? false : true));
  });
}

async function main() {
  // ── 1. Load .env ─────────────────────────────────────────────────────────
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    fatal(
      '.env file is missing!\n' +
      '  Run:  copy apps\\backend\\.env.example apps\\backend\\.env\n' +
      '  Then fill in your real DATABASE_URL and Meta credentials.',
    );
  }

  const raw = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }

  const errors   = [];
  const warnings = [];

  // ── 2. DATABASE_URL checks ────────────────────────────────────────────────
  const dbUrl = env['DATABASE_URL'] || '';

  if (!dbUrl) {
    errors.push('DATABASE_URL is empty. Set it in apps/backend/.env');
  } else if (
    dbUrl.includes('ep-xxxx') ||
    dbUrl.includes('user:password') ||
    dbUrl.includes('YOURPASSWORD') ||
    dbUrl.includes('neondb_owner:YOURPASSWORD')
  ) {
    errors.push(
      'DATABASE_URL still contains placeholder values.\n' +
      '  Replace it with your real Neon connection string:\n' +
      '  Neon Console → Project → Connection Details → Pooled connection',
    );
  } else {
    try {
      const u = new URL(dbUrl);
      const host = u.hostname;

      if (!host.includes('neon.tech')) {
        warnings.push(`DATABASE_URL host "${host}" doesn't look like a Neon endpoint. Proceeding anyway.`);
      }

      if (!host.includes('-pooler') && !dbUrl.includes('pgbouncer=true')) {
        warnings.push(
          'DATABASE_URL may be using the DIRECT (non-pooled) endpoint.\n' +
          '  Switch to the pooled URL (hostname contains "-pooler"):\n' +
          '  ep-xxxx-pooler.region.aws.neon.tech\n' +
          '  Add: ?sslmode=require&pgbouncer=true&connection_limit=1',
        );
      }

      if (!dbUrl.includes('sslmode=require')) {
        errors.push('DATABASE_URL is missing ?sslmode=require — Neon rejects non-SSL connections.');
      }

      if (!dbUrl.includes('pgbouncer=true')) {
        warnings.push(
          'DATABASE_URL is missing &pgbouncer=true — Prisma may fail with PgBouncer.',
        );
      }

      // DNS check
      const reachable = await dnsLookup(host);
      if (reachable) {
        console.log(`  ✅ DNS resolved: ${host}`);
      } else {
        warnings.push(`DNS lookup failed for "${host}". Check your internet connection.`);
      }

    } catch {
      errors.push(`DATABASE_URL is not a valid URL: "${dbUrl.slice(0, 60)}..."`);
    }
  }

  // ── 3. Meta credentials ───────────────────────────────────────────────────
  const metaFields = {
    META_VERIFY_TOKEN:    'your_webhook_verify_token_here',
    META_ACCESS_TOKEN:    'EAAxxxxxxxxxxxxxxxxxxxxxxxxxx',
    META_PHONE_NUMBER_ID: '123456789012345',
    META_WABA_ID:         '987654321098765',
  };

  for (const [key, placeholder] of Object.entries(metaFields)) {
    const val = env[key] || '';
    if (!val) {
      errors.push(`${key} is not set in .env`);
    } else if (val === placeholder) {
      warnings.push(`${key} still has its placeholder value — update it.`);
    }
  }

  // ── 4. Port check ─────────────────────────────────────────────────────────
  const port = parseInt(env['PORT'] || '3001', 10);
  const portStatus = await checkPort(port);

  if (portStatus === 'in-use') {
    errors.push(
      `Port ${port} is already in use!\n` +
      `  Kill the process occupying it:\n` +
      `    Windows:  netstat -ano | findstr :${port}   →  taskkill /PID <pid> /F\n` +
      `    Mac/Linux: lsof -ti:${port} | xargs kill -9`,
    );
  } else {
    console.log(`  ✅ Port ${port} is free`);
  }

  // ── 5. Report ──────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  🔍 WhatsApp Bot — Pre-flight Diagnostic');
  console.log('═══════════════════════════════════════════════════\n');

  if (warnings.length) {
    console.log('⚠️  Warnings:');
    warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}\n`));
  }

  if (errors.length) {
    console.log('❌ Errors (fix before starting):');
    errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}\n`));
    console.log('───────────────────────────────────────────────────');
    console.log('  ❌ Pre-flight FAILED — fix the errors above, then retry.\n');
    process.exit(1);
  } else {
    console.log('✅ All checks passed — safe to run: npm run dev');
    console.log('───────────────────────────────────────────────────\n');
  }
}

main().catch((err) => {
  console.error('Preflight script error:', err);
  process.exit(1);
});

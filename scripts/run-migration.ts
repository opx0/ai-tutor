import * as fs from 'fs';
import { prisma } from '../lib/prisma';

async function main() {
  const sql = fs.readFileSync('prisma/migrations/manual_schema_fix.sql', 'utf-8');

  // Split by semicolons but handle DO $$ blocks
  const statements: string[] = [];
  let current = '';
  let inBlock = false;

  for (const line of sql.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') && !inBlock) continue;

    if (trimmed.startsWith('DO $$')) inBlock = true;
    if (trimmed.includes('END $$;')) {
      current += line + '\n';
      statements.push(current.trim());
      current = '';
      inBlock = false;
      continue;
    }

    if (inBlock) {
      current += line + '\n';
      continue;
    }

    current += line + '\n';
    if (trimmed.endsWith(';')) {
      const stmt = current.trim();
      if (stmt.length > 1) statements.push(stmt);
      current = '';
    }
  }

  console.log(`Running ${statements.length} statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.replace(/\n/g, ' ').substring(0, 80);
    try {
      await prisma.$executeRawUnsafe(stmt.replace(/;$/, ''));
      console.log(`[${i + 1}/${statements.length}] OK: ${preview}`);
    } catch (e: any) {
      const msg = e.message?.substring(0, 120) || String(e);
      console.log(`[${i + 1}/${statements.length}] WARN: ${preview}`);
      console.log(`   Error: ${msg}`);
    }
  }

  await prisma.$disconnect();
  console.log('Done!');
}

main();

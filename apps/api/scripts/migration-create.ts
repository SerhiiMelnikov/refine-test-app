import { spawn } from 'child_process';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Usage: npm run migration:create <MigrationName>');
  process.exit(1);
}

const migrationPath = `migrations/${migrationName}`;

const child = spawn(
  'npx',
  ['typeorm-ts-node-commonjs', 'migration:create', migrationPath],
  { stdio: 'inherit' },
);

child.on('exit', (code) => process.exit(code));

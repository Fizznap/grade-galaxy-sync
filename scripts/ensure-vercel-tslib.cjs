const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceTslib = path.resolve(process.cwd(), 'node_modules/tslib');
const vercelFuncDir = path.resolve(process.cwd(), '.vercel/output/functions/__server.func');
const destTslib = path.join(vercelFuncDir, 'node_modules/tslib');
const libsDir = path.join(vercelFuncDir, '_libs');

console.log('Ensuring tslib is correctly bundled for Vercel...');

// 1. Verify source tslib exists
if (!fs.existsSync(sourceTslib)) {
  console.error('[Error] Source node_modules/tslib does not exist.');
  process.exit(1);
}

// 2. Verify Vercel function output exists
if (!fs.existsSync(vercelFuncDir)) {
  console.error(`[Error] Vercel function output directory does not exist: ${vercelFuncDir}`);
  process.exit(1);
}

// 3. Copy the entire package
try {
  fs.cpSync(sourceTslib, destTslib, { recursive: true });
  console.log(`Copied tslib to ${destTslib}`);
} catch (err) {
  console.error('[Error] Failed to copy tslib:', err.message);
  process.exit(1);
}

// 4. Verify the copied files
const expectedFiles = ['package.json', 'tslib.es6.mjs'];
for (const file of expectedFiles) {
  if (!fs.existsSync(path.join(destTslib, file))) {
    console.error(`[Error] Copied tslib is missing expected file: ${file}`);
    process.exit(1);
  }
}

// 5 & 6. Test ESM resolution from the chunk directory
if (!fs.existsSync(libsDir)) {
  console.error(`[Error] _libs directory does not exist: ${libsDir}`);
  process.exit(1);
}

const testFile = path.join(libsDir, '__test_resolution.mjs');
try {
  // We write an MJS script to test import.meta.resolve
  fs.writeFileSync(testFile, `
try {
  const resolved = import.meta.resolve('tslib');
  console.log(resolved);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
  `);
  
  const stdout = execSync(`node ${testFile}`, { encoding: 'utf-8' });
  if (!stdout.includes('node_modules/tslib')) {
    console.error('[Error] Resolution resolved to unexpected path:', stdout);
    process.exit(1);
  }
  
  console.log(`Successfully verified ESM resolution of tslib from _libs chunk! resolved path: ${stdout.trim()}`);
} catch (err) {
  console.error('[Error] Failed to resolve tslib from chunk:', err.stdout || err.message);
  process.exit(1);
} finally {
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
  }
}

console.log('Post-build verification successful.');

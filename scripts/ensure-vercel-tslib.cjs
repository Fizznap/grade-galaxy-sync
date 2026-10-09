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

// 7. Rewrite tslib imports in all generated chunks to use the explicit relative path
function rewriteImports(dir, relativeToNodeModules) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      rewriteImports(fullPath, '../' + relativeToNodeModules);
    } else if (f.endsWith('.mjs') || f.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      const importRegex = /from\s+['"]tslib['"]/g;
      if (importRegex.test(content)) {
        content = content.replace(importRegex, `from "${relativeToNodeModules}/tslib/modules/index.js"`);
        fs.writeFileSync(fullPath, content);
        console.log(`Rewrote tslib import in ${path.relative(vercelFuncDir, fullPath)}`);
      }
    }
  }
}

console.log('Rewriting tslib imports to explicit relative paths...');
rewriteImports(libsDir, '../node_modules');
rewriteImports(path.join(vercelFuncDir, '_ssr'), '../node_modules');
rewriteImports(path.join(vercelFuncDir, '_chunks'), '../node_modules');
// Also check root files like index.mjs
const rootFiles = fs.readdirSync(vercelFuncDir);
for (const f of rootFiles) {
  const fullPath = path.join(vercelFuncDir, f);
  if (!fs.statSync(fullPath).isDirectory() && (f.endsWith('.mjs') || f.endsWith('.js'))) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    const importRegex = /from\s+['"]tslib['"]/g;
    if (importRegex.test(content)) {
      content = content.replace(importRegex, `from "./node_modules/tslib/modules/index.js"`);
      fs.writeFileSync(fullPath, content);
      console.log(`Rewrote tslib import in ${f}`);
    }
  }
}

console.log('Post-build verification and rewrite successful.');

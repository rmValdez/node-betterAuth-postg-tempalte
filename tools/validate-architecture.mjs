#!/usr/bin/env node
/**
 * Clean Architecture Validator for Node.js / Express Backend
 *
 * Enforces strict layered boundaries:
 * - repositories: can only import utils, helpers, config, constants, prisma
 * - services: can import repositories, infrastructure, events, utils, helpers, constants (NEVER controllers or routes)
 * - controllers: can import services, helpers, utils, constants (NEVER repositories directly or routes)
 * - routes: wires controllers, middleware
 * - utils/helpers/constants: pure agnostic utilities
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../src');

let hasViolations = false;

function logViolation(file, rule, description) {
  console.error(`\x1b[31m[VIOLATION]\x1b[0m ${file}`);
  console.error(`  ↳ \x1b[33mRule:\x1b[0m ${rule}`);
  console.error(`  ↳ \x1b[36mDetails:\x1b[0m ${description}\n`);
  hasViolations = true;
}

function extractImports(content) {
  const imports = [];
  const importRegex = /(?:import\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"])|(?:require\(['"]([^'"]+)['"]\))/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1] || match[2]);
  }
  return imports;
}

function validateFile(filePath, relativePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = extractImports(content);

  const normalizedRelPath = relativePath.split(path.sep).join('/');
  const pathParts = normalizedRelPath.split('/');
  const layer = pathParts[0]; // e.g. 'controllers', 'services', 'repositories', 'routes', 'utils', 'helpers'

  for (const imp of imports) {
    // Check deep relative imports
    if (imp.startsWith('../../..') || imp.startsWith('../../../..')) {
      logViolation(
        normalizedRelPath,
        'Import Strategy',
        `Forbidden deep relative import "${imp}". Use absolute path or top-level layer imports.`
      );
    }

    // Determine target layer being imported
    let targetLayer = null;
    const normalizedImp = imp.replace(/^\.\.\//, '').replace(/^\.\//, '');
    const impParts = normalizedImp.split('/');
    if (['controllers', 'services', 'repositories', 'routes', 'middleware', 'helpers', 'utils', 'constants', 'infrastructure', 'events', 'consumers'].includes(impParts[0])) {
      targetLayer = impParts[0];
    }

    if (!targetLayer) continue;

    // Rule 1: Repositories cannot import services, controllers, or routes
    if (layer === 'repositories' && ['services', 'controllers', 'routes'].includes(targetLayer)) {
      logViolation(
        normalizedRelPath,
        'Layer Boundary Violation',
        `Repositories represent the data access layer and cannot import from "${targetLayer}" ("${imp}").`
      );
    }

    // Rule 2: Services cannot import controllers or routes
    if (layer === 'services' && ['controllers', 'routes'].includes(targetLayer)) {
      logViolation(
        normalizedRelPath,
        'Layer Boundary Violation',
        `Services represent business logic and cannot import from "${targetLayer}" ("${imp}").`
      );
    }

    // Rule 3: Controllers cannot import routes
    if (layer === 'controllers' && targetLayer === 'routes') {
      logViolation(
        normalizedRelPath,
        'Layer Boundary Violation',
        `Controllers cannot import from routes ("${imp}").`
      );
    }

    // Rule 4: Agnostic layers (utils, helpers, constants) cannot import business layers
    if (['utils', 'helpers', 'constants'].includes(layer) && ['controllers', 'services', 'repositories', 'routes'].includes(targetLayer)) {
      logViolation(
        normalizedRelPath,
        'Layer Boundary Violation',
        `Agnostic helper/utility/constant modules cannot depend on application business layer "${targetLayer}" ("${imp}").`
      );
    }
  }
}

function crawl(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      crawl(fullPath);
    } else if (stat.isFile() && /\.(ts|js|mjs)$/.test(file)) {
      const relativePath = path.relative(ROOT_DIR, fullPath);
      validateFile(fullPath, relativePath);
    }
  }
}

console.info(
  '\x1b[36m%s\x1b[0m',
  '🛡️  Running Backend Layer Architecture Boundary Scan...'
);
if (!fs.existsSync(ROOT_DIR)) {
  console.error(`Source root not found at target context path: ${ROOT_DIR}`);
  process.exit(1);
}

crawl(ROOT_DIR);

if (hasViolations) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    '❌ Layer architecture boundary checks failed. See violations above.'
  );
  process.exit(1);
} else {
  console.info(
    '\x1b[32m%s\x1b[0m',
    '✅ Backend architecture boundaries cleanly intact.'
  );
  process.exit(0);
}

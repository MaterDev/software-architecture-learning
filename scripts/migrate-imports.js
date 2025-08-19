#!/usr/bin/env node
/**
 * Migration script to update imports from old to new architecture
 * Run this to automatically update any remaining references to the old system
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const PROJECT_ROOT = globalThis.process?.cwd() || '.';
const SRC_DIR = join(PROJECT_ROOT, 'src');

// Import mappings from old to new architecture
const IMPORT_MAPPINGS = {
  '../utils/advancedPromptGenerator.js': '../engines/prompt/PromptEngine.js',
  './utils/advancedPromptGenerator.js': './engines/prompt/PromptEngine.js',
  '../data/core-concepts.json': '../data/sources/core-concepts.json',
  '../data/lesson-templates.json': '../data/sources/lesson-templates.json',
  '../data/contextual-scenarios.json': '../data/sources/contextual-scenarios.json',
  '../data/oblique-strategies.json': '../data/sources/oblique-strategies.json'
};

function findJSFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and test directories for this migration
        if (!item.startsWith('.') && item !== 'node_modules' && item !== '__tests__') {
          traverse(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = extname(item);
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

function updateImports(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Update import statements
    for (const [oldImport, newImport] of Object.entries(IMPORT_MAPPINGS)) {
      const oldPattern = new RegExp(`from\\s+['"]${oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
      if (oldPattern.test(content)) {
        content = content.replace(oldPattern, `from '${newImport}'`);
        hasChanges = true;
        console.log(`✓ Updated import in ${filePath}: ${oldImport} → ${newImport}`);
      }
    }
    
    // Update dynamic imports
    for (const [oldImport, newImport] of Object.entries(IMPORT_MAPPINGS)) {
      const oldDynamicPattern = new RegExp(`import\\s*\\(\\s*['"]${oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]\\s*\\)`, 'g');
      if (oldDynamicPattern.test(content)) {
        content = content.replace(oldDynamicPattern, `import('${newImport}')`);
        hasChanges = true;
        console.log(`✓ Updated dynamic import in ${filePath}: ${oldImport} → ${newImport}`);
      }
    }
    
    if (hasChanges) {
      writeFileSync(filePath, content, 'utf8');
    }
    
    return hasChanges;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔄 Starting import migration...\n');
  
  const jsFiles = findJSFiles(SRC_DIR);
  let totalUpdated = 0;
  
  for (const file of jsFiles) {
    if (updateImports(file)) {
      totalUpdated++;
    }
  }
  
  console.log(`\n✅ Migration complete! Updated ${totalUpdated} files.`);
  
  if (totalUpdated === 0) {
    console.log('ℹ️  No files needed updating - migration may have already been completed.');
  } else {
    console.log('\n📝 Next steps:');
    console.log('1. Run `bun test` to verify all tests pass');
    console.log('2. Start the dev server to test the UI');
    console.log('3. Remove the old advancedPromptGenerator.js file when ready');
  }
}

main();

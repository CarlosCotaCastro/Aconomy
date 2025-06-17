import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourcesDir = path.join(__dirname, 'resources', 'js');

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    
    if (stats.isDirectory()) {
      walkDir(filepath, callback);
    } else if (stats.isFile() && (filepath.endsWith('.jsx') || filepath.endsWith('.js') || filepath.endsWith('.tsx') || filepath.endsWith('.ts'))) {
      callback(filepath);
    }
  });
}

function updateGridInFile(filepath) {
  console.log(`Checking ${filepath}`);
  let content = fs.readFileSync(filepath, 'utf8');
  const originalContent = content;
  
  // Replace <Grid item xs={12} md={6}> with <Grid md={6} sm={12}>
  // This regex looks for Grid components with item and xs/sm/md props
  const itemRegex = /<Grid\s+item\s+(?:xs=\{([^}]+)\})?(?:\s+sm=\{([^}]+)\})?(?:\s+md=\{([^}]+)\})?(?:\s+lg=\{([^}]+)\})?(?:\s+xl=\{([^}]+)\})?([^>]*)>/g;
  
  content = content.replace(itemRegex, (match, xs, sm, md, lg, xl, rest) => {
    const newProps = [];
    
    if (md) newProps.push(`md={${md}}`);
    if (sm) newProps.push(`sm={${sm}}`);
    if (lg) newProps.push(`lg={${lg}}`);
    if (xl) newProps.push(`xl={${xl}}`);
    
    // If xs=12 is the only prop, we don't need it since Grid is 12 columns by default
    if (xs && xs !== '12' && !md && !sm && !lg && !xl) {
      // Only if xs has a value other than 12 and there are no other size props
      newProps.push(`xs={${xs}}`);
    }
    
    return `<Grid ${newProps.join(' ')}${rest}>`;
  });
  
  if (content !== originalContent) {
    console.log(`Updating ${filepath}`);
    fs.writeFileSync(filepath, content, 'utf8');
  }
}

// Walk through all files in the resources/js directory
walkDir(resourcesDir, updateGridInFile);

console.log('Grid component updates completed successfully!'); 
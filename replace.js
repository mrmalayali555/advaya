const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}
const dirs = ['src/app/adminahnuok', 'src/lib/actions', 'src/components/admin'];
let count = 0;
dirs.forEach(d => {
  if (fs.existsSync(d)) {
    const files = walk(d);
    files.forEach(f => {
      let content = fs.readFileSync(f, 'utf8');
      if (content.match(/["`\/]admin\//)) {
        content = content.replace(/(["`])\/admin\//g, '$1/adminahnuok/');
        fs.writeFileSync(f, content, 'utf8');
        console.log('Updated: ' + f);
        count++;
      }
    });
  }
});
console.log('Fixed ' + count + ' files.');

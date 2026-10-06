const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '..');
const paths = process.argv.slice(2);
if (!paths.length) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'app.config.json'), 'utf8'));
  paths.push('src/index.template.html', config.repository.name.replace(/^htmlapps-/i, '') + '.html', config.build.output);
  if (config.build.selfExtract?.enabled) paths.push(config.build.selfExtract.output);
}
for (const source of paths) {
  console.log('\n[Return regression] ' + source);
  const result = spawnSync(process.execPath, ['--test', 'tests/return-search.test.cjs'], {
    cwd: root, env: { ...process.env, LOAN_BOARD_SOURCE: source }, stdio: 'inherit'
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

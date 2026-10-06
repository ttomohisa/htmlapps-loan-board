const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../scripts/test-return-search.cjs'), 'utf8');
function run(args, config) {
  const tested = [];
  vm.runInNewContext(source, {
    __dirname: path.join(__dirname, '../scripts'), console: { log() {} },
    process: { argv: ['node', 'runner', ...args], execPath: 'node', env: {}, exit: code => { throw Error('exit ' + code); } },
    require(name) {
      if (name === 'node:path') return path;
      if (name === 'node:fs') return { readFileSync: () => JSON.stringify(config) };
      if (name === 'node:child_process') return { spawnSync: (_, __, options) => { tested.push(options.env.LOAN_BOARD_SOURCE); return { status: 0 }; } };
      throw Error('Unexpected dependency ' + name);
    }
  });
  return tested;
}
test('runner follows configured root, readable and self-extract names instead of stale default files', () => {
  assert.deepEqual(run([], { repository: { name: 'htmlapps-custom-board' }, build: { output: 'release/readable.html', selfExtract: { enabled: true, output: 'release/compact.html' } } }), ['src/index.template.html', 'custom-board.html', 'release/readable.html', 'release/compact.html']);
});
test('runner respects explicit build variants and disabled self-extract configuration', () => {
  assert.deepEqual(run(['custom.html'], {}), ['custom.html']);
  assert.deepEqual(run([], { repository: { name: 'loan-board' }, build: { output: 'standalone.html', selfExtract: { enabled: false, output: 'unused.html' } } }), ['src/index.template.html', 'loan-board.html', 'standalone.html']);
});

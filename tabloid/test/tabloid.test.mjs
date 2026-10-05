import { test } from 'node:test';
import assert from 'node:assert/strict';

// The spec for tabloid. These tests define CORRECT behavior; run `npm run
// build` first — they import the built bundle, like real consumers do.
import {
  escapeCell,
  parseAlignment,
  renderTable,
} from '../dist/index.js';

test('escapeCell escapes literal pipes so they cannot split columns (issue #12)', () => {
  assert.equal(escapeCell('a|b'), 'a\\|b');
  assert.equal(escapeCell('left||right'), 'left\\|\\|right');
});

test('escapeCell escapes backslashes without eating the following pipe (issue #12)', () => {
  assert.equal(escapeCell('back\\slash'), 'back\\\\slash');
  assert.equal(escapeCell('trailing\\'), 'trailing\\\\');
});

test('escapeCell flattens newlines and trims outer space', () => {
  assert.equal(escapeCell('  two\nlines  '), 'two lines');
});

test('parseAlignment recognizes all four separator forms (issue #18)', () => {
  assert.equal(parseAlignment(':---'), 'left');
  assert.equal(parseAlignment('---'), 'left');
  assert.equal(parseAlignment(':---:'), 'center');
  assert.equal(parseAlignment('---:'), 'right');
});

test('renderTable emits an alignment-carrying separator row (issue #18)', () => {
  const table = renderTable(
    ['name', 'qty', 'price'],
    [['nut', '4', '0.25']],
    [':---', ':---:', '---:'],
  );
  assert.equal(
    table,
    ['| name | qty | price |', '| :--- | :---: | ---: |', '| nut | 4 | 0.25 |'].join('\n'),
  );
});

test('renderTable escapes cell content so column counts stay stable (issue #12)', () => {
  const table = renderTable(['expr', 'value'], [['a|b', 'two\\|cols']]);
  // Every rendered row must have exactly 3 unescaped pipes for 2 columns.
  for (const line of table.split('\n')) {
    const unescaped = line.replaceAll('\\|', '');
    assert.equal(unescaped.split('|').length - 1, 3);
  }
  assert.ok(table.includes('a\\|b'));
});

test('renderTable defaults every column to left alignment', () => {
  const table = renderTable(['a', 'b'], [['1', '2']]);
  assert.ok(table.includes('| :--- | :--- |'));
});

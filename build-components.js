#!/usr/bin/env node
/* ============================================================
   Ladydee Minimart Store — component inline-copy generator
   ------------------------------------------------------------
   The shared header / footer / bottom bar live in components/*.html.
   components.js ALSO needs a built-in copy of that markup so the site
   still renders when it is opened straight off disk (file://), where the
   browser blocks fetch() of local files.

   Run this after editing any file in components/:

       node build-components.js

   It rewrites only the block between the GENERATED:INLINE markers inside
   components.js — everything else in that file is left alone.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = __dirname;
var NAMES = ['header', 'footer', 'bottom-nav'];
var TARGET = path.join(ROOT, 'components.js');
var START = '/* >>> GENERATED:INLINE >>> */';
var END = '/* <<< GENERATED:INLINE <<< */';

var inline = {};
NAMES.forEach(function (name) {
  var file = path.join(ROOT, 'components', name + '.html');
  if (!fs.existsSync(file)) {
    console.error('  ! missing ' + path.relative(ROOT, file));
    process.exitCode = 1;
    return;
  }
  inline[name] = fs.readFileSync(file, 'utf8');
  console.log('  + ' + name + ' (' + inline[name].length + ' bytes)');
});

if (process.exitCode) {
  console.error('Aborted — one or more component files are missing.');
  process.exit(1);
}

var src = fs.readFileSync(TARGET, 'utf8');
var start = src.indexOf(START);
var end = src.indexOf(END);
if (start < 0 || end < 0 || end < start) {
  console.error('Aborted — could not find the GENERATED:INLINE markers in components.js.');
  process.exit(1);
}

var body = JSON.stringify(inline, null, 2)
  .split('\n')
  .map(function (l, i) { return i === 0 ? l : '  ' + l; })
  .join('\n');

var next = src.slice(0, start + START.length) +
  '\n  var INLINE = ' + body + ';\n  ' +
  src.slice(end);

fs.writeFileSync(TARGET, next);
console.log('\ncomponents.js updated — inline fallback now mirrors components/*.html');

/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, usc = '_', arSlc = Array.prototype.slice, isBuf = Buffer.isBuffer,
  univeil = require('univeil');

function fail(why) { throw new Error(why); }
function ifDef(x) { return (x !== undefined); }
function lc(s) { return String(s || '').toLowerCase(); }
function each(f, a) { return a.forEach(f); }
function pushTo(a, b) { return a.push.apply(a, b); }
function orf(x) { return (x || false); }

function jsonify(x) {
  return JSON.stringify(x, null, 1).replace(/\s+/g, ' '
    ).replace(/"/g, '');
}


EX = function observe(subj, name, log) {
  if (!subj) { fail('Expected EventEmitter but got a false-y value'); }
  if (!log) { log = 'warn'; }
  if (typeof log === 'string') { log = console[log].bind(console); }
  var meta = {};
  function addMeta(k, v) { if (ifDef(v)) { meta[k] = v; } }
  EX.sockProps.forEach(function (p) { addMeta(p, subj[p]); });
  addMeta('handleFd', orf(subj[usc + 'handle']).fd);
  if (!name) { name = jsonify(meta); }
  function logEvt(v) {
    var a = arSlc.call(arguments, 1);
    log.apply(null, [name, v].concat(a.map(EX.buf2str)));
  }
  EX.evNames.forEach(function (v) { subj.on(v, logEvt.bind(null, v)); });
};


EX.sockProps = [ 'name', 'path', 'fd' ];
each(function (w) {
  pushTo(EX.sockProps, [ lc(w), 'local' + w, 'remote' + w ]);
}, [ 'Address', 'Port', 'Family' ]);


EX.evNames = [
  //#.evNames
  'abort',
  'aborted',
  'beforeExit',
  'change',
  'close',
  'connect',
  'connected',
  'connection',
  'continue',
  'cork',
  'data',
  'disconnect',
  'disconnected',
  'drain',
  'end',
  'error',
  'exit',
  'finish',
  'line',
  'listen',
  'listening',
  'lookup',
  'message',
  'open',
  'pause',
  'pipe',
  'readable',
  'ready',
  'request',
  'reset',
  'resize',
  'response',
  'resume',
  'secureConnect',
  'socket',
  'start',
  'stop',
  'sync',
  'timeout',
  'uncork',
  'unpipe',
  'upgrade',
  'warning',
  'writable',
  'writeable',
  //#
];


EX.buf2str = function (x) {
  if (!isBuf(x)) { return x; }
  var l = x.length, s, n;
  x = x.slice(0, 256);
  s = x.toString('UTF-8');
  n = (orf(s.match(/\uFFFD/g)).length || 0) / x.length;
  if (n > 0.2) { s = x.toString('binary'); }
  s = 'buf[' + l + '] ' + univeil(JSON.stringify(s));
  if (x.length < l) { s += '…'; }
  return s;
};












module.exports = EX;

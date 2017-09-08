/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, usc = '_', arSlc = Array.prototype.slice, isBuf = Buffer.isBuffer;

function ifDef(x) { return (x !== undefined); }
function lc(s) { return String(s || '').toLowerCase(); }
function each(f, a) { return a.forEach(f); }
function pushTo(a, b) { return a.push.apply(a, b); }
function buf2str(x) { return (isBuf(x) ? x.toString('UTF-8') : x); }
function orf(x) { return (x || false); }

function jsonify(x) {
  return JSON.stringify(x, null, 1).replace(/\s+/g, ' '
    ).replace(/"/g, '');
}


EX = function observe(s, name, log) {
  if (!log) { log = 'warn'; }
  if (typeof log === 'string') { log = console[log].bind(console); }
  var meta = {};
  function addMeta(k, v) { if (ifDef(v)) { meta[k] = v; } }
  EX.sockProps.forEach(function (p) { addMeta(p, s[p]); });
  addMeta('handleFd', orf(s[usc + 'handle']).fd);
  if (!name) { name = jsonify(meta); }
  function logEvt(v) { log(name, v, arSlc.call(arguments, 1).map(buf2str)); }
  EX.evNames.forEach(function (v) { s.on(v, logEvt.bind(null, v)); });
};


EX.sockProps = [ 'name', 'path', 'fd' ];
each(function (w) {
  pushTo(EX.sockProps, [ lc(w), 'local' + w, 'remote' + w ]);
}, [ 'Address', 'Port', 'Family' ]);

EX.evNames = [
  //#.evNames
  'error', 'end', 'close', 'finish',
  'open',   // e.g. file streams
  'connect', 'connected',       // net.Socket + common mistake
  'disconnect', 'disconnected',
  'start', 'stop', 'ready',     // additional generic names
  'drain', 'data',
  'pause', 'resume', 'continue',
  'readable', 'writable', 'writeable',
  'pipe', 'unpipe', 'cork', 'uncork',
  //#
];






module.exports = EX;

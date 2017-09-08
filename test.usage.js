/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';


var test = {}, equal = require('equal-pmb');

test.log = [];
test.log.args = function () { test.log.push(Array.from(arguments)); };

test.log.verify = function () {
  equal.lists(test.log, test.log.expect);
  console.log("+OK usage test passed.");    //= "+OK usage test passed."
};



(function readmeDemo() {
  //#u
  var posixPipe = require('posix-pipe'), pair = posixPipe(),
    rd = pair[0], wr = pair[1],
    observeStreamEvents = require('log-stream-events-pmb');

  observeStreamEvents(rd, '|->', test.log.args);
  observeStreamEvents(wr, '->|', test.log.args);

  function send(t, x) {
    setTimeout(function () {
      test.log.args('send:', x);
      if (x === null) { wr.end(); } else { wr.write(x); }
    }, t * 1000);
  }

  send(0.3, 'Hello ');
  send(0.5, 'World!\n');
  send(0.7, null);
  setTimeout(test.log.verify, 1000);

  test.log.expect = [
    [ '|->', 'resume', [] ],
    [ '->|', 'resume', [] ],
    [ 'send:', 'Hello ' ],
    [ '|->', 'data', [ 'Hello ' ] ],
    [ 'send:', 'World!\n' ],
    [ '|->', 'data', [ 'World!\n' ] ],
    [ 'send:', null ],
    [ '->|', 'finish', [] ],
    [ '|->', 'readable', [] ],
    [ '|->', 'end', [] ],
    [ '|->', 'close', [ false ] ],
    [ '->|', 'close', [ false ] ],
  ];
  //#r
}());

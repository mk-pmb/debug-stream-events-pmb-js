
<!--#echo json="package.json" key="name" underline="=" -->
log-stream-events-pmb
=====================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Install logging handlers on a variety of stream-related events.
<!--/#echo -->


API
---

This module exports one function:

### observe(subj[, name[, logFunc]])

* `subj` should be an EventEmitter, e.g. a Stream or a Socket.
* `name` can be a name to use for reporting events on `subj`.
  If omitted or false-y, `observe` tries to guess a JSON-y name from
  properties of `subj`, e.g. an address or a file descriptor number.
* `logFunc` can be a function used to report the events.
  It can also be a string, in which case it's understood as the name
  of a method on the global `console` object.
  If omitted or false-y, `console.warn` is used.

The `observe` function has these properties:
* `.evNames` is an array of event names to which `observe` will subscribe.


Usage
-----

from [test.usage.js](test.usage.js):

<!--#include file="test.usage.js" start="  //#u" stop="  //#r"
  outdent="  " code="javascript" -->
<!--#verbatim lncnt="35" -->
```javascript
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
setTimeout(test.log.verify, 2000);

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
```
<!--/include-->



<!--#toc stop="scan" -->


Event names list
----------------

The last time this readme was updated, `observe.evNames` had:

<!--#include file="log.js" start="  //#.evNames" stop="  //#"
  cut-head="  '" cut-tail="'," -->
<!--#verbatim lncnt="45" -->
abort
aborted
beforeExit
change
close
connect
connected
connection
continue
cork
data
disconnect
disconnected
drain
end
error
exit
finish
line
listen
listening
lookup
message
open
pause
pipe
readable
ready
request
reset
resize
response
resume
secureConnect
socket
start
stop
sync
timeout
uncork
unpipe
upgrade
warning
writable
writeable
<!--/include-->


Known issues
------------

* needs more/better tests and docs




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->

/*
 * Copyright 2011-2012 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var vertxTest = require('vertx_tests');
var vassert = vertxTest.vassert;

var eb = require('vertx/event_bus');
var timers = require('vertx/timer');
var Buffer = require('vertx/buffer');
var address = 'foo-address';

var sent = {
  price : 23.45,
  name : 'tim'
};

var emptySent = {
  address : address
};

var reply = {
  desc: "approved",
  status: 123
}

var assertSent = function(msg) {
  vassert.assertTrue(sent.price === msg.price);
  vassert.assertEquals(sent.name, msg.name);
}


var assertReply = function(rep) {
  vassert.assertEquals(reply.desc, rep.desc);
  vassert.assertTrue(reply.status === rep.status);
}

var echo = function(msg) {
  var ebus = eb.registerHandler(address, function MyHandler(received, replier) {
    eb.unregisterHandler(address, MyHandler);
    replier(received);
  });
  vassert.assertTrue(ebus === eb);
  ebus = eb.send(address, msg, function (reply){

  if (msg != null) {
    for (field in reply) {
      vassert.assertEquals(msg.field, reply.field);
    }
  }
  vassert.assertTrue(ebus === eb);
  vassert.testComplete();
  });
}

var NoopHandler = function(msg, replier) {
}
var timeout = 500;
var console = require('vertx/console');
var timers  = require('vertx/timer');

var EventBusTest = {

  testSendWithTimeoutGetsReply: function() {

    eb.registerHandler(address, function(msg, replier) {
      replier(reply);
    });
    eb.sendWithTimeout(address, sent, timeout, function(err, msg) {
      vassert.assertTrue("Message should not have timed out and passed an error", err === null);
      vassert.assertEquals(reply.desc, msg.desc)
      vassert.assertTrue("Unexpected reply.status", reply.status === msg.status)
      vassert.testComplete();
    });
  },

  testReplyWithTimeoutGetsReply: function() {

    eb.registerHandler(address, function(msg, replier) {
      replier(reply, function(err, msg) {
        vassert.assertEquals("ack", msg);
        vassert.testComplete();
      }, timeout);
    });
    eb.send(address, sent, function(msg, replier) {
      vassert.assertEquals(reply.desc, msg.desc)
      vassert.assertTrue("Unexpected reply.status", reply.status === msg.status)
      replier("ack");
    });
  },

  testSendWithTimeoutReplyTimesOut: function() {

    eb.registerHandler(address, function(msg, replier) {
      timers.setTimer(timeout*2, function() {
        replier("response");
      });
    });
    eb.sendWithTimeout(address, "message", timeout, function(err, msg) {
      vassert.assertTrue("Message should have timed out and passed an error", err != null);
      vassert.assertTrue("Message should have timed out, but got: " + msg, msg === null);
      vassert.testComplete();
    });
  },

  testReplyWithTimeoutReplyTimesOut: function() {

    eb.registerHandler(address, function(msg, replier) {
      replier(reply, function(err, msg) {
        vassert.assertTrue("Message should have timed out and passed an error", err != null);
        vassert.assertTrue("Message should have timed out, but got: " + msg, msg === null);
        vassert.testComplete();
      }, timeout);
    });

    eb.send(address, sent, function(msg, replier) {
      vassert.assertEquals(reply.desc, msg.desc)
      vassert.assertTrue("Unexpected reply.status", reply.status === msg.status)
      timers.setTimer(timeout*2, function() {
        replier("ack");
      });
    });
  },

  testSetGetDefaultReplyTimeout: function() {
    vassert.assertTrue("Expected default timeout of -1", eb.getDefaultReplyTimeout() === -1);
    vassert.assertTrue(eb.setDefaultReplyTimeout(timeout) === eb);
    vassert.assertTrue("Expected default timeout of " + timeout, eb.getDefaultReplyTimeout() === timeout);
    eb.setDefaultReplyTimeout(-1);
    vassert.testComplete();
  },

  testSendWithDefaultTimeoutReplyTimesOut: function() {
    eb.setDefaultReplyTimeout(timeout);

    // delayed response handler
    eb.registerHandler(address, function(msg, replier) {
      // reply after the handler should have timed out
      timers.setTimer(timeout*2, function() {
        replier("response");
        eb.send(address + ".end", "end", function(msg, replier) {
          vassert.testComplete();
        });
      });
    });

    // end test handler
    eb.registerHandler(address + ".end", function(msg, replier) {
      replier("ack");
    });

    // send a message that should time out
    eb.send(address, "message", function(msg) {
      vassert.fail("Reply handler should not be called");
    });
  },

  testRegistrationHandler: function() {
    eb.registerHandler(address, NoopHandler, function() {
      eb.unregisterHandler(address, NoopHandler);
      vassert.testComplete();
    });
  },

  testUnregistrationHandler: function() {
    var handleCount = 0;
    var handler = function(msg, replier) {
      vassert.fail("Handler should have been unregistered");
      vassert.testComplete();
    }
    eb.registerHandler(address, handler, function() {
      eb.unregisterHandler(address, handler, function() {
        eb.registerHandler(address, function(msg, replier) {
          handleCount = handleCount + 1;
          if (handleCount == 3) {
            vassert.testComplete();
          }
        }, function() {
          eb.send(address, sent);
          eb.send(address, sent);
          eb.send(address, sent);
        });
      });
    });
  },

  testSimple: function() {
    var handled = false;
    var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
      vassert.assertTrue(!handled);
      assertSent(msg);
      eb.unregisterHandler(address, MyHandler);
      handled = true;
      vassert.testComplete();
    });
    vassert.assertTrue(ebus === eb);
    vassert.assertTrue(eb.send(address, sent) === eb);
  },

  testEmptyMessage: function() {

    var handled = false;
    var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
      vassert.assertTrue(!handled);
      vassert.assertTrue(eb.unregisterHandler(address, MyHandler) === eb);
      handled = true;
      vassert.testComplete();
    });
    vassert.assertTrue(ebus === eb);
    vassert.assertTrue(eb.send(address, emptySent) === eb);
  },


  testUnregister: function() {

    var handled = false;
    var MyHandler = function(msg, replier) {
      vassert.assertTrue(!handled);
      assertSent(msg);
      vassert.assertTrue(eb.unregisterHandler(address, MyHandler) === eb);
      // Unregister again - should do nothing
      vassert.assertTrue(eb.unregisterHandler(address, MyHandler) === eb);
      handled = true;
      // Wait a little while to allow any other messages to arrive
      timers.setTimer(100, function() {
        vassert.testComplete();
      });
    }
    var ebus = eb.registerHandler(address, MyHandler);

    for (var i = 0; i < 2; i++) {
      vassert.assertTrue(eb.send(address, sent) === eb);
    }
  },

  testWithReply: function() {

    var handled = false;
    var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
      vassert.assertTrue(!handled);
      assertSent(msg);
      vassert.assertTrue(eb.unregisterHandler(address, MyHandler) === eb);
      handled = true;
      replier(reply);
    });
    vassert.assertTrue(ebus === eb);

    ebus = eb.send(address, sent, function(reply) {
      assertReply(reply);
      vassert.testComplete();
    });
    vassert.assertTrue(ebus === eb);
  },

  testReplyOfReplyOfReply: function() {

    var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
      vassert.assertEquals("message", msg);
      replier("reply", function(reply, replier) {
        vassert.assertEquals("reply-of-reply", reply);
        replier("reply-of-reply-of-reply");
        vassert.assertTrue(eb.unregisterHandler(address, MyHandler) === eb);
      });
    });
    vassert.assertTrue(ebus === eb);

    ebus = eb.send(address, "message", function(reply, replier) {
      vassert.assertEquals("reply", reply);
      replier("reply-of-reply", function(reply) {
        vassert.assertEquals("reply-of-reply-of-reply", reply);
        vassert.testComplete();
      });
    });
    vassert.assertTrue(ebus === eb);
  },

  testEmptyReply: function() {

    var handled = false;
    var ebus = eb.registerHandler(address, function MyHandler(msg, replier) {
      vassert.assertTrue(!handled);
      assertSent(msg);
      vassert.assertTrue(eb.unregisterHandler(address, MyHandler) === eb);
      handled = true;
      replier({});
    });
    vassert.assertTrue(ebus === eb);

    ebus = eb.send(address, sent, function(reply) {
      vassert.testComplete();
    });
    vassert.assertTrue(ebus === eb);
    vassert.assertTrue(eb.send(address, sent) === eb);
  },

  testEchoString: function() {
    echo("foo");
  },

  testEchoNumber1: function() {
    echo(1234);
  },

  testEchoNumber2: function() {
    echo(1.2345);
  },

  testEchoBooleanTrue: function() {
    echo(true);
  },

  testEchoBooleanFalse: function() {
    echo(false);
  },

  testEchoJson: function() {
    echo(sent);
  },

  testEchoBuffer: function() {
    echo(new Buffer());
  },

  testEchoNull: function() {
    echo(null);
  }
}

vertxTest.startTests(EventBusTest);


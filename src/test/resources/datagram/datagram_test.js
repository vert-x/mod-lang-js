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

var udp       = require('vertx/datagram');

var tu        = require('test_utils');
var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;

DatagramTest = {

  testSendReceive: function() {
    var peer1 = new udp.DatagramSocket();
    var peer2 = new udp.DatagramSocket();
    peer2.exceptionHandler(function(err) {
      vassert.assertTrue("Should receive an error object in the exception handler", err !== null);
      vassert.fail("Exception caught: " + err.toString());
    });

    peer2.listen(1234, '127.0.0.1', function(err, result) {
      vassert.assertTrue("Error: " + err, err === null);
      vassert.assertTrue("Unexpected result: " + result.toString(), peer2 === result);
      buffer = tu.generateRandomBuffer(128);
      peer2.dataHandler( function(packet) {
        vassert.assertTrue( tu.buffersEqual(packet.data, buffer) );
        vassert.testComplete();
      });

      peer1.send('127.0.0.1', 1234, buffer, function(err, result) {
        vassert.assertTrue("Error: " + err, err === null);
        vassert.assertTrue("Unexpected result: " + result.toString(), peer1 == result);
      });
    });
  },

}

vertxTest.startTests(DatagramTest);





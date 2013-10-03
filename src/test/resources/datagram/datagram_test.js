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
    peer1 = new udp.DatagramSocket();
    peer2 = new udp.DatagramSocket();
    peer2.exceptionHandler(function(err) {
      vassert.assertTrue("Should receive an error object in the exception handler", err !== null);
      vassert.fail("Exception caught: " + err);
    });

    peer2.listen(1234, '127.0.0.1', function(err, result) {
      vassert.assertTrue("Error: " + err, err === null);
      vassert.assertTrue("Unexpected result: " + result, peer2 === result);
      buffer = tu.generateRandomBuffer(128);
      peer2.dataHandler( function(packet) {
        vassert.assertTrue( tu.buffersEqual(packet.data, buffer) );
        vassert.testComplete();
      });

      peer1.send('127.0.0.1', 1234, buffer, function(err, result) {
        vassert.assertTrue("Error: " + err, err === null);
        vassert.assertTrue("Unexpected result: " + result, peer1 == result);
      });
    });
  },

  testListenHostPort: function() {
    socket = new udp.DatagramSocket();
    socket.listen(1234, '127.0.0.1', function(err, result) {
      vassert.assertTrue("Error: " + err, err === null);
      vassert.assertTrue("Unexpected result: " + result, socket == result);
      socket.close(function() {
        vassert.testComplete();
      });
    });
  },

  testListenPort: function() {
    socket = new udp.DatagramSocket();
    socket.listen(1234, function(err, result) {
      vassert.assertTrue("Error: " + err, err === null);
      vassert.assertTrue("Unexpected result: " + result, socket == result);
      socket.close(function() {
        vassert.testComplete();
      });
    });
  },

  DEFERREDtestListenSamePortMultipleTimes: function() {
    peer1= new udp.DatagramSocket();
    peer2= new udp.DatagramSocket();

    peer2.listen(1234, function(err, result) {
      vassert.assertTrue("Error: " + err, err === null);
      vassert.assertTrue("Unexpected result: " + result, result == peer2);
      peer1.listen(1234, function(err, result) {
        vassert.assertTrue("Error: " + err, err === null);
        vassert.assertTrue("Unexpected result: " + result, result == peer1);
        vassert.testComplete();
      });
    });
  },

  testEcho: function() {
    peer1 = new udp.DatagramSocket();
    peer2 = new udp.DatagramSocket();

    peer1.exceptionHandler(function(err) {
      vassert.assertTrue("Exception should not be null", err !== null);
      vassert.fail("Error: " + err);
    });
    peer2.exceptionHandler(function(err) {
      vassert.assertTrue("Exception should not be null", err !== null);
      vassert.fail("Error: " + err);
    });

    peer2.listen(1234, '127.0.0.1', function(err, result) {
      vassert.assertTrue("Unexpected error: " + err, err === null);
      vassert.assertTrue("Unexpected result: " + result, result == peer2);
      buffer = tu.generateRandomBuffer(128);

      peer2.dataHandler(function(packet) {
        vassert.assertTrue("Unexpected data received: " + packet, tu.buffersEqual(buffer, packet.data));

        peer2.send(packet.sender.host, packet.sender.port, buffer, function(err, result) {
          vassert.assertTrue("Error: " + err, err === null);
          vassert.assertTrue("Unexpected result: " + result, result == peer2);
        });
      });

      peer1.listen(1235, '127.0.0.1', function(err, result) {
        peer1.dataHandler(function(packet) {
          vassert.assertTrue("Unexpected data received: " + packet, tu.buffersEqual(buffer, packet.data));
          vassert.testComplete();
        });
      });
      peer1.send('127.0.0.1', 1234, buffer, function(err, result) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Unexpected result: " + result, result == peer1);
      });
    });
  },

  testSendAfterClose: function() {
    peer1 = new udp.DatagramSocket();
    peer2 = new udp.DatagramSocket();

    peer1.close(function() {
      peer1.send('127.0.0.1', 1234, 'test', function(err, result) {
        vassert.assertTrue("Should have recieved an error.", err !== null);
        vassert.assertTrue("Should have recieved an error.", err !== undefined);
        vassert.assertTrue("Should not have recieved a result.", result === null);
        peer2.close(function() {
          peer2.send('127.0.0.1', 1234, 'test', function(err, result) {
            vassert.assertTrue("Should have recieved an error.", err !== null);
            vassert.assertTrue("Should have recieved an error.", err !== undefined);
            vassert.assertTrue("Should not have recieved a result.", result === null);
            vassert.testComplete();
          });
        });
      });
    });
  },

  testBroadcast: function() {
    peer1 = new udp.DatagramSocket();
    peer2 = new udp.DatagramSocket();

    peer1.broadcast(true);
    peer2.broadcast(true);

    peer2.listen(1234, function(err, result) {
      vassert.assertTrue("Unexpected error: " + err, err === null);
      vassert.assertTrue("Unexpected result: " + result, result == peer2);

      buffer = tu.generateRandomBuffer(128);

      peer2.dataHandler(function(packet) {
        vassert.assertTrue("Unexpected data: " + packet.data, tu.buffersEqual(packet.data, buffer));
        vassert.testComplete();
      });

      peer1.send('255.255.255.255', 1234, buffer, function(err, result) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Unexpected result: " + result, result == peer1);
      });
    });
  }

}

var console = require('vertx/console'), peer1, peer2;
vertxStop = function() {
  peer1 == null ? null : peer1.close();
  peer2 == null ? null : peer2.close();
  console.log("Container stopping.");
}

vertxTest.startTests(DatagramTest);

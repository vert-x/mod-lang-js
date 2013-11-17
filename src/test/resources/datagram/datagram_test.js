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
var timer     = require('vertx/timer');

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

  testListenSamePortMultipleTimes: function() {
    peer1= new udp.DatagramSocket();
    peer2= new udp.DatagramSocket();

    peer2.listen(1234, function(err, result) {
      vassert.assertTrue("Error: " + err, err === null);
      vassert.assertTrue("Unexpected result: " + result, result === peer2);
      peer1.listen(1234, function(err, result) {
        vassert.assertTrue("Error: " + err, err !== null);
        vassert.assertTrue("Unexpected result: " + result, result === null);
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
  },

  testLocalAddress: function() {
    socket = new udp.DatagramSocket(true);
    // address is not set until we start listening on the socket
    vassert.assertTrue(socket.localAddress() === undefined);
    socket.listen(54321, function(err, result) {
      vassert.assertTrue("Unexpected error: " + err, err === null);
      vassert.assertTrue("Unexpected result: " + result, result === socket);
      var address = socket.localAddress();
      vassert.assertTrue("No socket address assigned", address !== undefined);
      vassert.assertTrue("Unexpeected port number", 54321 === address.port);
      vassert.assertEquals('0.0.0.0', address.address);
      vassert.assertEquals('IPv4', address.family);
      vassert.testComplete();
    });
  },

  testConfigure: function() {
    peer1 = new udp.DatagramSocket(udp.InternetProtocolFamily.IPv4);

    vassert.assertTrue("Incorrect default for broadcast", !peer1.broadcast());
    peer1.broadcast(true);
    vassert.assertTrue("Change to broadcast failed", peer1.broadcast());

    vassert.assertTrue("Incorrect default for multicast loopback mode", peer1.multicastLoopbackMode());
    peer1.multicastLoopbackMode(false);
    vassert.assertTrue("Change to multicast loopback mode failed", !peer1.multicastLoopbackMode());

    vassert.assertTrue("Incorrect default for multicast network interface", peer1.multicastNetworkInterface() == null);
    var iface = null;
    ifaces = java.net.NetworkInterface.getNetworkInterfaces();
    while(ifaces.hasMoreElements()) {
      var networkInterface = ifaces.nextElement();
      try {
        if (networkInterface.supportsMulticast()) {
          var addresses = networkInterface.getInetAddresses();
          while(addresses.hasMoreElements()) {
            if (addresses.nextElement() instanceof java.net.Inet4Address) {
              iface = networkInterface;
            }
          }
          if (iface != null) {
            peer1.multicastNetworkInterface(iface.getName());
            vassert.assertTrue("Change to multicast network interface failed", peer1.multicastNetworkInterface() == iface.getName());
          }
        }
      } catch(err) {
        // This is likely an issue with the underlying network interfaces in CI
        // NetworkInterface#supportsMulticast can throw a SocketException if
        // an IO error occurs, which has been known to happen on CI
        java.lang.System.err.println("ERROR: Exception during test. " + err);
      }
    }

    vassert.assertTrue("Incorrect default for receive buffer size", peer1.receiveBufferSize() != 1024);
    peer1.receiveBufferSize(1024);

    vassert.assertTrue("Incorrect default for send buffer size", peer1.sendBufferSize() != 1024);
    peer1.sendBufferSize(1024);

    vassert.assertTrue("Incorrect default for reuse address", !peer1.reuseAddress());
    peer1.reuseAddress(true);
    vassert.assertTrue("Change to reuse address failed", peer1.reuseAddress());

    vassert.assertTrue("Incorrect default for multicast ttl", peer1.multicastTimeToLive() != 2);
    peer1.multicastTimeToLive(2);
    vassert.assertTrue("Change to multicast multicast ttl failed", peer1.multicastTimeToLive() == 2);

    vassert.testComplete();
  },

  DEFERREDtestMulticastJoinLeave: function() {
    buffer = tu.generateRandomBuffer(128);
    groupAddress = '230.0.0.1';
    received = false;

    peer1 = new udp.DatagramSocket();
    peer2 = new udp.DatagramSocket();

    var console = require('vertx/console')
    peer2.dataHandler(function(packet) {
      vassert.assertTrue(tu.buffersEqual(buffer, packet.data));

      // leave the group
      peer2.unlistenMulticastGroup(groupAddress, function(err, socket) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Unexpected result: " + socket, socket === peer2);

        // set a data handler that shouldn't be called
        peer2.dataHandler(function(packet) {
          vassert.fail("Should not have received a packet after leaving the multicast group. " + packet);
        });

        // now send another message, and wait to see if peer2 gets it
        peer1.send(groupAddress, 1234, buffer, function(err, socket) {
          vassert.assertTrue("Unexpected error: " + err, err === null);
          vassert.assertTrue("Unexpected result: " + socket, socket === peer1);

          timer.setTimer(1000, function() {
            // peer2 didn't get the message - good
            vassert.testComplete();
          });
        });
      });

    });

    peer2.listen(1234, '127.0.0.1', function(err, peer) {
      vassert.assertTrue("Unexpected error: " + err, err === null);
      vassert.assertTrue("Unexpected result: " + peer, peer === peer2);

      // join the group
      peer2.listenMulticastGroup(groupAddress, function(err, socket) {
        vassert.assertTrue("Unexpected error: " + err, err === null);
        vassert.assertTrue("Unexpected result: " + socket, socket === peer2);

        // send a message to the group
        peer1.send(groupAddress, 1234, buffer, function(err, socket) {
          vassert.assertTrue("Unexpected error: " + err, err === null);
          vassert.assertTrue("Unexpected result: " + socket, socket === peer1);
        });
      });
    });
  }

}

var console = require('vertx/console'), peer1, peer2;
vertxStop = function() {
  peer1 == null ? null : peer1.close();
  peer2 == null ? null : peer2.close();
}

vertxTest.startTests(DatagramTest);

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

var vertx = require('vertx');
var vertxTest = require('vertx_tests');
var vassert = vertxTest.vassert;

NetTest = {
  testConnect: function() {
    var server = vertx.net.createNetServer();

    server.connectHandler(function(sock) {
      vassert.assertTrue(sock.localAddress().ipaddress != null)
      vassert.assertTrue(sock.localAddress().port > -1)
      vassert.assertTrue(sock.remoteAddress().ipaddress != null)
      vassert.assertTrue(sock.remoteAddress().port > -1)
      sock.dataHandler(function(data) {
        sock.write(data);
      });
    });

    server.listen(1234, 'localhost', function(err, server) {
      vassert.assertTrue(err === null);

      client = vertx.net.createNetClient();
      client.connect(1234, 'localhost', function(err, sock) {
        vassert.assertTrue(err === null);
        vassert.assertTrue(sock != null);
        vassert.assertTrue(err === null);
        vassert.assertTrue(sock != null);
        vassert.assertTrue(sock.localAddress().ipaddress != null)
        vassert.assertTrue(sock.localAddress().port > -1)
        vassert.assertTrue(sock.remoteAddress().ipaddress != null)
        vassert.assertTrue(sock.remoteAddress().port > -1)

        sock.dataHandler(function(data) {
          vassert.testComplete();
        });

        sock.write( new vertx.Buffer('this is a buffer'));
      });
    });
  },

  testNoConnect: function() {
    client = vertx.net.createNetClient();
    client.connect(1234, 'not-exists', function(err, sock) {
      vassert.assertTrue(err != null);
      vassert.testComplete();
    });
  }
}

vertxTest.startTests(NetTest);


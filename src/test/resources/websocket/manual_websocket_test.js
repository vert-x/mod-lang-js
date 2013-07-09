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

// Convenience
var Byte = java.lang.Byte;
var Long = java.lang.Long;

// vert.x stuffs
var vertx = require('vertx');
var vertxTest = require("vertx_tests");
var vassert = vertxTest.vassert;

// test objects
var server = vertx.http.createHttpServer();
var client = vertx.http.createHttpClient().port(8080);

var sha1 = function(s) {
  b = new vertx.Buffer(s, "UTF-8");
  md = java.security.MessageDigest.getInstance("SHA1");
  bytes = md.digest(b.getBytes());
  return org.vertx.java.core.json.impl.Base64.encodeBytes(bytes);
}

vertxTest.startTests({
  testManualWebSockets: function() {
    var path    = "/some/path";
    var message = "chili cheese fries";

    server.requestHandler(function(req) {
      vassert.assertEquals(path, req.path());
      vassert.assertEquals("Upgrade", req.headers().get("Connection"));

      var sock  = req.netSocket();
      var secHeader = req.headers().get("Sec-WebSocket-Key");
      var secKey = secHeader + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
      sock.write("HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
                 "Upgrade: WebSocket\r\n" +
                 "Sec-WebSocket-Accept: " + sha1(secKey) + "\r\n" +
                 "Connection: Upgrade\r\n" +
                 "\r\n");

      // write raw text frame
      var buff = new vertx.Buffer();
      var txtFrame = new java.lang.Byte(129);
      var txtLength = new java.lang.Byte(message.length);

      buff.appendByte(txtFrame);
      buff.appendByte(txtLength);
      buff.appendString(message);
      sock.write(buff);
    });

    server.listen(8080, "0.0.0.0", function(err, srv) {
      vassert.assertTrue(err === null);
      client.connectWebsocket(path, function(ws) {
        ws.dataHandler(function(buffer) {
          vassert.assertEquals(message, buffer.toString('UTF-8'));
          vassert.testComplete();
        });
      });
    });
  }
});


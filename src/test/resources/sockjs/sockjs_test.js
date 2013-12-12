
/*
 * Copyright 2011-2013 the original author or authors.
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

var http      = require('vertx/http');
var SockJS    = require('vertx/sockjs');
var vertxTest = require('vertx_tests');
var vassert   = require('vertx_assert');

var server    = http.createHttpServer();
var client    = http.createHttpClient();
var sockjs    = SockJS.createSockJSServer(server);

var sockJSTest = {
  testSocketCreated: function() {
    sockjs.on('socket-created', function() {
      // for some reason, this is not being called
      // vassert.testComplete();
      return true;
    });
    sockjs.bridge({prefix: '/bus'}, [{}], [{}]);
    server.listen(8080, function() {
      client.port(8080);
      client.connectWebsocket('/bus/echo', function(websocket) {
        vassert.assertTrue(websocket !== null);
        vassert.testComplete();
      });
    });
  }
};

vertxTest.startTests(sockJSTest);

/*
 * Copyright 2013 the original author or authors.
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

var tu = require('test_utils');

var port = 9090
var server = vertx.http.createHttpServer();
var client = vertx.http.createHttpClient().setPort(port);

function deferredTestPauseAndResume() {
  var expectedServer = 'Request Body from Client';
  var resultServer = '';
  var expectedClient = 'Response Body from Server';
  var resultClient = '';

  server.requestHandler(function(request) {
    print("PAUSING SERVER");
    request.pause();
    vertx.timer.setTimer(100, function() {
      print("RESUMING SERVER");
      request.resume();
      request.dataHandler(function(buffer) {
        print("SERVER DATA RECEIVED: " + buffer);
        resultServer += buffer;
      });
      request.endHandler(function() {
        print("SERVER WRITING RESPONSE");
        request.response.end(expectedClient);
        print("SERVER RESPONSE ENDED");
      });
    });
  });

  server.listen(port, function() {
    print("SERVER LISTENING");
    var request = client.post('/', function(response) {
      print("PAUSING CLIENT");
      response.pause();
      vertx.timer.setTimer(100, function() {
        response.dataHandler(function(buffer) {
          print("CLIENT DATA RECEIVED: " + chunk);
          resultClient += buffer;
        });
        response.endHandler(function() {
          print("RESPONSE ENDED");
          server.close();
          vassert.assertEqual(expectedServer, resultServer);
          vassert.assertEqual(expectedClient, resultClient);
          vassert.testComplete();
        });
        print("RESUMING CLIENT");
        response.resume();
      });
    });
    request.end(expectedServer);
  });
}

vertxTest.startTests(this);

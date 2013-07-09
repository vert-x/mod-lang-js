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

var tu = require('test_utils');

ParseToolsTest = {
  testDelimited: function() {
    var lineCount = 0;
    var numLines = 3;
    var output = function(line) {
      if (++lineCount == numLines) {
        vassert.testComplete();
      }
    }

    var rp = vertx.parseTools.createDelimitedParser('\n', output);
    var input = "qwdqwdline1\nijijiline2\njline3\n";
    var buffer = new vertx.Buffer(input);
    rp.handle(buffer);
  },

  testFixed: function() {
    var chunkCount = 0;
    var numChunks = 3;
    var chunkSize = 100;
    var output = function(chunk) {
      vassert.assertTrue(chunkSize === chunk.length());
      if (++chunkCount == numChunks) {
        vassert.testComplete();
      }
    }

    var rp = vertx.parseTools.createFixedParser(chunkSize, output);
    var input = new vertx.Buffer(0);
    for (var i = 0; i < numChunks; i++) {
      var buff = tu.generateRandomBuffer(chunkSize);
      input.appendBuffer(buff);
    }
    rp.handle(input);
  }
}

vertxTest.startTests(ParseToolsTest);


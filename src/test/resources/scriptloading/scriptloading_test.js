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
var vertxTest = require("vertx_tests");
vassert = vertxTest.vassert;

load("script1.js");

ScriptLoadingTest = {

  testVertxLoad: function() {
    load('script3.js');
    vassert.testComplete();
  },

  testScriptLoading: function() {
    vassert.assertTrue(func1() === 'foo');
    vassert.testComplete();
  },

  // Test that you can't use load() to load the vert.x CommonJS modules
  testCantLoadModules: function() {
    try {
      load("vertx.js");
      vassert.fail("Shouldn't be able to use load() for vertx anymore");
    } catch (err) {
      // OK
    }
    vassert.testComplete()
  },

  testLoadInCommonJSModuleDoesntPolluteGlobal: function() {
    var f = require("./mod");
    vassert.assertTrue(f() == "blah");
    vassert.assertTrue(typeof foo === 'undefined')
    vassert.testComplete()
  },

  testRequireAll: function() {
    vassert.assertTrue(typeof vertx.createNetServer === 'function');
    vassert.assertTrue(typeof vertx.createNetClient === 'function');
    vassert.assertTrue(typeof vertx.createHttpServer === 'function');
    vassert.assertTrue(typeof vertx.createHttpClient === 'function');
    vassert.testComplete()
  },

  testLoadExecutesInSameScopeAsCaller: function() {
    load('script4.js');
  }

}


vertxTest.startTests(ScriptLoadingTest);

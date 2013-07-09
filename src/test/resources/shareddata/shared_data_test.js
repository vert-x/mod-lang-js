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
var vassert = vertxTest.vassert;

SharedDataTest = {
  testMap: function() {
    var map1 = vertx.sharedData.getMap("foo");
    vassert.assertTrue(typeof map1 != undefined);
    var map2 = vertx.sharedData.getMap("foo");
    vassert.assertTrue(typeof map2 != undefined);
    vassert.assertTrue(map1 === map2);
    var map3 = vertx.sharedData.getMap("bar");
    vassert.assertTrue(typeof map3 != undefined);
    vassert.assertTrue(map3 != map2);

    var key = "blah";

    map1.put(key, 123);
    var val = map1.get(key);
    vassert.assertTrue(typeof val === 'number');
    vassert.assertTrue(val === 123);

    map1.put(key, 1.2345);
    var val = map1.get(key);
    vassert.assertTrue(typeof val === 'number');
    vassert.assertTrue(val === 1.2345);

    map1.put(key, "quux");
    var val = map1.get(key);
    vassert.assertTrue(typeof val === 'string');
    vassert.assertTrue(val === "quux");

    map1.put(key, true);
    var val = map1.get(key);
    vassert.assertTrue(typeof val === 'boolean');
    vassert.assertTrue(val === true);

    map1.put(key, false);
    var val = map1.get(key);
    vassert.assertTrue(typeof val === 'boolean');
    vassert.assertTrue(val === false);

    //Most testing done in Java tests

    vassert.testComplete();
  },

  testSet: function() {

    var set1 = vertx.sharedData.getSet("foo");
    vassert.assertTrue(typeof set1 != undefined);
    var set2 = vertx.sharedData.getSet("foo");
    vassert.assertTrue(typeof set2 != undefined);
    vassert.assertTrue(set1 === set2);
    var set3 = vertx.sharedData.getMap("bar");
    vassert.assertTrue(typeof set3 != undefined);
    vassert.assertTrue(set3 != set2);

    var key = "blah";

    set1.add(123);
    var val = set1.iterator().next();
    vassert.assertTrue(typeof val === 'number');
    vassert.assertTrue(val === 123);
    set1.clear();

    set1.add(1.2345);
    var val = set1.iterator().next();
    vassert.assertTrue(typeof val === 'number');
    vassert.assertTrue(val === 1.2345);
    set1.clear();

    set1.add("quux");
    var val = set1.iterator().next();
    vassert.assertTrue(typeof val === 'string');
    vassert.assertTrue(val === "quux");
    set1.clear();

    set1.add(true);
    var val = set1.iterator().next();
    vassert.assertTrue(typeof val === 'boolean');
    vassert.assertTrue(val === true);
    set1.clear();

    set1.add(false);
    var val = set1.iterator().next();
    vassert.assertTrue(typeof val === 'boolean');
    vassert.assertTrue(val === false);

    //Most testing done in Java tests

    vassert.testComplete();
  }
}

vertxTest.startTests(SharedDataTest);

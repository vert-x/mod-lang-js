/*
 * Copyright 2014 the original author or authors.
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

var vertx     = require('vertx');
var Buffer    = require('vertx/buffer');

var vertxTest = require('vertx_tests');
var tu        = require('test_utils');
var vassert   = vertxTest.vassert;

var BufferTest = {
  testConstructor: function() {
    var s = "some string";
    var b = new Buffer();
    vassert.assertTrue(0 === b.length());
    b = new Buffer(s);
    vassert.assertTrue(s.length === b.length());
    b = new Buffer(1024);
    vassert.assertTrue(0 === b.length());
    vassert.testComplete();
  },

  testSetGetByte: function() {
    var s = "some string";
    var b = new Buffer(s);
    vassert.assertTrue(32 === b.getByte(4));
    b.setByte(4, 95);
    vassert.assertEquals("some_string", b.toString());
    vassert.testComplete();
  },

  testSetGetInt: function() {
    var b = new Buffer();
    b.setInt(4, 1024);
    vassert.assertTrue(1024 === b.getInt(4));
    vassert.testComplete();
  },

  testSetGetDouble: function() {
    var b = new Buffer();
    b.setDouble(4, 3.14);
    vassert.assertTrue(3.14 === b.getDouble(4));
    vassert.testComplete();
  },

  testSetGetFloat: function() {
    var b = new Buffer();
    var f = 3.14;
    b.setFloat(4, f);
    vassert.assertEquals(f, b.getFloat(4), 0.0001);
    vassert.testComplete();
  },

  testSetGetShort: function() {
    var b = new Buffer();
    var s = 3;
    b.setShort(4, s);
    vassert.assertTrue(s === b.getShort(4));
    vassert.testComplete();
  },

  testGetBuffer: function() {
    var s = "some string";
    var b = new Buffer(s);
    vassert.assertEquals("me str", b.getBuffer(2, 8).toString());
    vassert.testComplete();
  },

  testGetString: function() {
    var s = "some string";
    var b = new Buffer(s);
    vassert.assertEquals("me str", b.getString(2, 8));
    vassert.testComplete();
  }, 

  testAppendBuffer: function() {
    var s = "some";
    var t = " string";
    var b = new Buffer(s);
    b.appendBuffer(new Buffer(t));
    vassert.assertEquals("some string", b.toString());
    vassert.testComplete();
  },

  testAppendString: function() {
    var s = "some";
    var t = " string";
    var b = new Buffer(s);
    b.appendString(t);
    vassert.assertEquals("some string", b.toString());
    vassert.testComplete();
  },

  testAppendByte: function() {
    var b = new Buffer("some string");
    b.appendByte(95);
    vassert.assertEquals("some string_", b.toString());
    vassert.testComplete();
  },

  testAppendInt: function() {
    var b = new Buffer();
    b.appendInt(32);
    vassert.assertTrue(32 === b.getInt(0));
    vassert.testComplete();
  },

  testAppendShort: function() {
    var b = new Buffer();
    b.appendShort(32);
    vassert.assertTrue(32 === b.getShort(0));
    vassert.testComplete();
  },

  testAppendFloat: function() {
    var b = new Buffer();
    b.appendFloat(3.14);
    vassert.assertEquals(3.14, b.getFloat(0), 0.0001);
    vassert.testComplete();
  },

  testAppendDouble: function() {
    var b = new Buffer();
    b.appendDouble(3.14);
    vassert.assertEquals(3.14, b.getDouble(0), 0.0001);
    vassert.testComplete();
  },

  testCopyEquals: function() {
    var b = new Buffer("some string");
    var c = b.copy();
    vassert.assertEquals(b.toString(), c.toString());
    vassert.assertTrue(b.equals(c));
    vassert.testComplete();
  },
};

vertxTest.startTests(BufferTest);

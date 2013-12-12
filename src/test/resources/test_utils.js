
var vertx = require('vertx');

var TestUtils = function() {

  var that = this;
  var jutils = new org.vertx.java.testframework.TestUtils(__jvertx);

  that.expected = function(expects, gets) {
    return "Expected [" + expects + "] but got [" + gets + "]."
  }

  that.azzert = function(result, message) {
    if (message) {
      jutils.azzert(result, message);
    } else {
      jutils.azzert(result);
    }
  }

  that.appReady = function() {
    jutils.appReady();
  }

  that.appStopped = function() {
    jutils.appStopped();
  }

  that.testComplete = function() {
    jutils.testComplete();
  }

  that.register = function(testName, test) {
    jutils.register(testName, test);
  }

  that.registerTests = function(obj) {
    for(var key in obj) {
      var val = obj[key];
      if (typeof val === 'function' && key.substring(0, 4) === 'test') {
        jutils.register(key, val);
      }
   }
  }

  that.unregisterAll = function() {
    jutils.unregisterAll();
  }

  that.checkThread = function() {
    jutils.checkThread();
  }

  that.generateRandomBuffer = function(size) {
    return new vertx.Buffer(org.vertx.java.testframework.TestUtils.generateRandomBuffer(size));
  }

  that.randomUnicodeString = function(size) {
    return org.vertx.java.testframework.TestUtils.randomUnicodeString(size);
  }

  that.buffersEqual = function(buff1, buff2) {
    if (buff1 instanceof vertx.Buffer) {
      buff1 = buff1._to_java_buffer();
    }
    if (buff2 instanceof vertx.Buffer) {
      buff2 = buff2._to_java_buffer();
    }
    return org.vertx.java.testframework.TestUtils.buffersEqual(buff1, buff2);
  }

};

module.exports = new TestUtils();

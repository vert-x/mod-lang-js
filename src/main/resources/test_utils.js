
var vertx = require('vertx');

var TestUtils = function() {

  this.generateRandomBuffer = function(size) {
    return new vertx.Buffer(org.vertx.java.testframework.TestUtils.generateRandomBuffer(size));
  };

  this.randomUnicodeString = function(size) {
    return org.vertx.java.testframework.TestUtils.randomUnicodeString(size);
  };

  this.buffersEqual = function(buff1, buff2) {
    if (buff1 instanceof vertx.Buffer) {
      buff1 = buff1._to_java_buffer();
    }
    if (buff2 instanceof vertx.Buffer) {
      buff2 = buff2._to_java_buffer();
    }
    return org.vertx.java.testframework.TestUtils.buffersEqual(buff1, buff2);
  };

};

module.exports = new TestUtils();

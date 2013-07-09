if (typeof __vertxload === 'string') {
  throw "Use require() to load Vert.x API modules"
}

var vertxTests = {};

var container = require("vertx/container");
vertxTests.vassert = org.vertx.testtools.VertxAssert;

vertxTests.startTests = function (top) {
  var methodName = container.config.methodName;
  vertxTests.vassert.initialize(__jvertx);
  top[methodName]();
}

module.exports = vertxTests;


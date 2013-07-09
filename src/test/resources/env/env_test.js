var container = require('vertx/container');
var vertxTest = require('vertx_tests');
var vassert = vertxTest.vassert;

function testEnv() {
  container.deployVerticle("deploy/child.js", function() {
    vassert.testComplete();
    // env var is set in pom.xml maven-failsafe-plugin
    vassert.assertEquals("Gouda", container.env['cheese']);
    vassert.testComplete();
  });
}

vertxTest.startTests(this);

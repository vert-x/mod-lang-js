var container = require('vertx/container');
var vertxTest = require('vertx_tests');
var vassert = vertxTest.vassert;

vertxTest.startTests({
  testEnv: function() {
    container.deployVerticle("deploy/child.js", function() {
      // env var is set in pom.xml maven-failsafe-plugin
      vassert.assertEquals("Gouda", container.env.get('cheese'));
      vassert.assertEquals("Gouda", container.env['cheese']);
      vassert.testComplete();
    });
  }
});

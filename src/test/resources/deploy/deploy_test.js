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

var container = require('vertx/container');
var vertxTest = require('vertx_tests');
var vassert = vertxTest.vassert;

DeployTest = {
  testSimpleDeploy: function() {
    container.deployVerticle("deploy/child.js", function(err, deployId) {
      vassert.assertEquals(null, err);
      vassert.assertTrue(deployId != null);
      vassert.testComplete();
    });
  },

  testDeployWithConfig: function() {
    var conf = {'foo': 'bar'}
    container.deployVerticle("deploy/child.js", conf, function(err, deployId) {
      vassert.assertEquals(null, err);
      // this should work?
      //vassert.assertEquals('bar', container.config['foo']);
      vassert.assertTrue(deployId != null);
      vassert.testComplete();
    });
  },

  testDeployWithNumInstances: function() {
    container.deployVerticle("deploy/child.js", 12, function(err, deployId) {
      vassert.assertEquals(null, err);
      vassert.assertTrue(deployId != null);
      vassert.testComplete();
    });
  },

  testDeployWithConfigAndNumInstances: function() {
    var conf = {foo: 'bar'}
    container.deployVerticle("deploy/child.js", conf, 12, function(err, deployId) {
      vassert.assertEquals(null, err);
      vassert.assertTrue(deployId != null);
      vassert.testComplete();
    });
  },

  testDeployFail: function() {
    container.deployVerticle("deploy/notexist.js", function(err, deployId) {
      vassert.assertFalse(null === err);
      vassert.assertEquals(null, deployId);
      vassert.testComplete();
    });
  },

  testUndeploy: function() {
    container.deployVerticle("deploy/child.js", function(err, deployId) {
      container.undeployVerticle(deployId, function(err) {
        vassert.assertTrue(null === err);
        vassert.testComplete();
      });
    });
  },

  testUndeployFail: function() {
    container.deployVerticle("deploy/child.js", function(err, deployId) {
      container.undeployVerticle('someotherid', function(err) {
        vassert.assertFalse(null === err);
        vassert.testComplete();
      });
    });
  },

  testDeployWorker: function() {
    container.deployWorkerVerticle('deploy/child.js', function(err, deployId) {
      vassert.assertTrue(null === err);
      vassert.assertTrue(deployId !== null);
      vassert.testComplete();
    });
  }

}

vertxTest.startTests(DeployTest);

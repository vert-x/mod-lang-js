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

var deployTest = {
  testSimpleDeploy: function() {
    container.deployVerticle("child.js", function(err, deployId) {
      vassert.assertTrue(null === err);
      vassert.assertTrue(deployId != null);
      vassert.testComplete();
    });
  },

  testDeployWithConfig: function() {
    var conf = {'foo': 'bar'}
    container.deployVerticle("child.js", conf, function(err, deployId) {
      vassert.assertTrue(null === err);
      // this should work?
      //vassert.assertEquals('bar', container.config['foo']);
      vassert.assertTrue(deployId != null);
      vassert.testComplete();
    });
  },

  testDeployWithNumInstances: function() {
    container.deployVerticle("child.js", 12, function(err, deployId) {
      vassert.assertTrue(null === err);
      vassert.assertTrue(deployId != null);
      vassert.testComplete();
    });
  },

  testDeployWithConfigAndNumInstances: function() {
    var conf = {foo: 'bar'}
    container.deployVerticle("child.js", conf, 12, function(err, deployId) {
      vassert.assertTrue(null === err);
      vassert.assertTrue(deployId != null);
      vassert.testComplete();
    });
  },

  testDeployFail: function() {
    container.deployVerticle("notexist.js", function(err, deployId) {
      vassert.assertFalse(null === err);
      vassert.assertTrue(null === deployId);
      vassert.testComplete();
    });
  },

  testUndeploy: function() {
    container.deployVerticle("child.js", function(err, deployId) {
      container.undeployVerticle(deployId, function(err) {
        vassert.assertTrue(null === err);
        vassert.testComplete();
      });
    });
  },

  testUndeployFail: function() {
    container.deployVerticle("child.js", function(err, deployId) {
      container.undeployVerticle('someotherid', function(err) {
        vassert.assertFalse(null === err);
        vassert.testComplete();
      });
    });
  },

  testDeployWorker: function() {
    container.deployWorkerVerticle('child.js', function(err, deployId) {
      vassert.assertTrue(null === err);
      vassert.assertTrue(deployId !== null);
      vassert.testComplete();
    });
  }

}

vertxTest.startTests(deployTest);

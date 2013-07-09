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

var tu = require('test_utils');
var vertxTest = require('vertx_tests');
var vassert = vertxTest.vassert;

var fs = require("vertx/file_system")
var Pump = require("vertx/pump")

var fileDir = "js-test-output"

// More tests needed

FsTest = {

  testCopy: function() {
    var from = fileDir + "/foo.tmp";
    var to = fileDir + "/bar.tmp";
    var content = "some-data";
    fs.writeFile(from, content, function() {
      fs.copy(from, to, function(err, res) {
        vassert.assertEquals(null, err);
        fs.readFile(to, function(err, res) {
          vassert.assertEquals(null, err);
          vassert.assertEquals(content, res.toString());
          vassert.testComplete();
        });
      });
    });
  },

  testMove: function() {
    var from = fileDir + "/foo.tmp";
    var to = fileDir + "/bar.tmp";
    var content = "some-data";
    fs.writeFile(from, content, function() {
      fs.move(from, to, function(err, res) {
        vassert.assertEquals(null, err);
        fs.readFile(to, function(err, res) {
          vassert.assertEquals(null, err);
          vassert.assertEquals(content, res.toString());
          fs.exists(from, function(err, res) {
            vassert.assertEquals(null, err);
            vassert.assertTrue(!res);
            vassert.testComplete();
          });
        });
      });
    });
  },

  testMkDir: function() {
    // arguments: string, boolean, handler
    var dir = fileDir + "/foo/bar";
    fs.mkDir(dir, true, function(err, res) {
      vassert.assertEquals(null, err);
      fs.readDir(dir, function(err, res) {
        vassert.assertEquals(null, err);
        vassert.testComplete();
      });
    });
  },

  testMkDirSync: function() {
    var dir = fileDir + "/testMkDirSync";
    fs.mkDirSync(dir);
    fs.readDir(dir, function(err, res) {
      vassert.assertEquals(null, err);
      vassert.testComplete();
    });
  },

  testReadDir: function() {
    var file1 = fileDir + "/foo.tmp";
    var file2 = fileDir + "/bar.tmp";
    var file3 = fileDir + "/baz.tmp";
    var content = "some-data";
    fs.writeFile(file1, content, function() {
      fs.writeFile(file2, content, function() {
        fs.writeFile(file3, content, function() {
          fs.readDir(fileDir, function(err, res) {
            vassert.assertEquals(null, err);
            vassert.assertEquals("3", res.length.toString());
            vassert.testComplete();
          });
        })
      })
    });
  },

  testProps: function() {
    var file = fileDir + "/foo.tmp";
    var content = "some-data";
    fs.writeFile(file, content, function() {
      fs.props(file, function(err, res) {
        vassert.assertEquals(null, err);
        vassert.assertTrue(res.isRegularFile);
        vassert.assertEquals('number', typeof res.creationTime);
        vassert.assertEquals('number', typeof res.lastAccessTime);
        vassert.assertEquals('number', typeof res.lastModifiedTime);
        vassert.testComplete();
      });
    });
  },

  testPumpFile: function() {
    var from = fileDir + "/foo.tmp";
    var to = fileDir + "/bar.tmp";
    var content = tu.generateRandomBuffer(10000);
    fs.writeFile(from, content, function() {
      fs.open(from, function(err, file1) {
        vassert.assertEquals(null, err);
        fs.open(to, function(err, file2) {
          vassert.assertEquals(null, err);
          var rs = file1;
          var ws = file2;
          var pump = new Pump(rs, ws);
          pump.start();
          rs.endHandler(function() {
            file1.close(function() {
              file2.close(function() {
                fs.readFile(to, function(err, res) {
                  vassert.assertEquals(null, err);
                  vassert.assertTrue(tu.buffersEqual(content, res));
                  vassert.testComplete();
                });
              });
            });
          });
        });
      });
    });
  }
}

function setup(doneHandler) {
  fs.exists(fileDir, function(err, exists) {
    if (exists) {
      fs.delete(fileDir, true, function() {
        fs.mkDir(fileDir, function() {
          doneHandler();
        });
      });
    } else {
      fs.mkDir(fileDir, function() {
        doneHandler();
      });
    }
  });
}


setup(function() {
  vertxTest.startTests(FsTest);
});

function vertxStop() {
  fs.deleteSync(fileDir, true);
}


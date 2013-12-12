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

var fs       = require("vertx/file_system");
var Pump     = require("vertx/pump");
var Buffer   = require("vertx/buffer");
var console  = require('vertx/console');

var fileDir  = "js-test-output";
var content  = "some-data";
var testFile = fileDir + "/writeFile.txt";



var asyncFileTest = {
  testWrite: function() {
    fs.open(testFile, function(err, asyncFile) {
      if (err) {
        vassert.fail('Failed to open file ' + err);
      } else {
        var buffer = new Buffer("more data");
        asyncFile.write(buffer, 0, function() {
          asyncFile.close(); // Close it    
          fs.readFile(testFile, function(err, buf) {
            vassert.assertEquals("more data", buf.toString());
            vassert.testComplete()
          });
        });
      }
    });
  }, 

  testWriteWithOffset: function() {
    fs.open(testFile, function(err, asyncFile) {
      if (err) {
        vassert.fail('Failed to open file ' + err);
      } else {
        var buffer = new Buffer(" more data");
        asyncFile.write(buffer, 4, function() {
          asyncFile.close(); // Close it    
          fs.readFile(testFile, function(err, buf) {
            vassert.assertEquals("some more data", buf.toString());
            vassert.testComplete()
          });
        });
      }
    });
  },

  testFlush: function() {
    fs.open(testFile, function(err, asyncFile) {
      if (err) {
        vassert.fail('Failed to open file ' + err);
      } else {
        var buffer = new Buffer("more data");
        asyncFile.write(buffer, 0, function() {
        });
        asyncFile.flush(function() {
          asyncFile.close(); // Close it    
          fs.readFile(testFile, function(err, buf) {
            vassert.assertEquals("more data", buf.toString());
            vassert.testComplete()
          });
        });
      }
    });
  }, 

  testClose: function() {
    fs.open(testFile, function(err, asyncFile) {
      if (err) {
        vassert.fail('Failed to open file ' + err);
      } else {
        asyncFile.close(function() {
            vassert.testComplete()
        });
      }
    });
  }, 

  testRead: function() {
    fs.open(testFile, function(err, asyncFile) {
      if (err) {
        vassert.fail('Failed to open file ' + err);
      } else {
        asyncFile.read(new Buffer(), 0, 0, 4, function(err, buf) {
          vassert.assertEquals("some", buf.toString());
          vassert.testComplete();
        }); // asyncFile.read
      }
    }); // fs.open
  },

}

function setup(doneHandler) {
  fs.exists(fileDir, function(err, exists) {
    if (exists) {
      fs.delete(fileDir, true, function() {
        fs.mkDir(fileDir, function() {
          fs.writeFile(testFile, content, function() {
            doneHandler();
          });
        });
      });
    } else {
      fs.mkDir(fileDir, function() {
        fs.writeFile(testFile, content, function() {
          doneHandler();
        });
      });
    }
  });
}


setup(function() {
  vertxTest.startTests(asyncFileTest);
});

function vertxStop() {
  fs.deleteSync(fileDir, true);
}



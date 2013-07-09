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

var vertx = require('vertx');
var vertxTest = require("vertx_tests");
var vassert = vertxTest.vassert;

var setEndTimer = function() {
  vertx.timer.setTimer(10, function() {
    vassert.testComplete();
  })
}

var TimerTest = {
  testOneOff: function() {
    var count = 0;
    var id = vertx.timer.setTimer(1000, function(timer_id) {
      vassert.assertTrue(id === timer_id);
      vassert.assertTrue(count === 0);
      count++;
      setEndTimer();
    });
  },

  testPeriodic: function() {
    var numFires = 10;
    var delay = 100;
    var count = 0;
    var id = vertx.timer.setPeriodic(delay, function(timer_id) {
      vassert.assertTrue(id === timer_id);
      count++;
      if (count === numFires) {
        vertx.timer.cancelTimer(timer_id);
        setEndTimer();
      }
      if (count > numFires) {
        vassert.fail(false, "Fired too many times");
      }
    });
  }
}

vertxTest.startTests(TimerTest);


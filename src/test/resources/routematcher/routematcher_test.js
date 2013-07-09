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
var vertxTest = require('vertx_tests');
var vassert = vertxTest.vassert;

var server = vertx.http.createHttpServer();
var rm = new vertx.http.RouteMatcher();
server.requestHandler(rm);

var client = vertx.http.createHttpClient().port(9999);

var params = { "name" : "foo", "version" : "v0.1"};
var re_params = { "param0" : "foo", "param1" :"v0.1"};
var regex = "\\/([^\\/]+)\\/([^\\/]+)";

RouteMatcherTest = {
  testGetWithPattern: function() {
    route('get', false, "/:name/:version", params, "/foo/v0.1")
  },

  testGetWithRegEx: function() {
    route('get', true, regex, re_params, "/foo/v0.1");
  },

  testPutWithPattern: function() {
    route('put', false, "/:name/:version", params, "/foo/v0.1");
  },

  testPutWithRegEx: function() {
    route('put', true, regex, re_params, "/foo/v0.1");
  },

  testPostWithPattern: function() {
    route('post', false, "/:name/:version", params, "/foo/v0.1");
  },

  testPostWithRegEx: function() {
    route('post', true, regex, re_params, "/foo/v0.1");
  },

  testDeleteWithPattern: function() {
    route('delete', false, "/:name/:version", params, "/foo/v0.1");
  },

  testDeleteWithRegEx: function() {
    route('delete', true, regex, re_params, "/foo/v0.1");
  },

  testOptionsWithPattern: function() {
    route('options', false, "/:name/:version", params, "/foo/v0.1");
  },

  testOptionsWithRegEx: function() {
    route('options', true, regex, re_params, "/foo/v0.1");
  },

  testHeadWithPattern: function() {
    route('head', false, "/:name/:version", params, "/foo/v0.1");
  },

  testHeadWithRegEx: function() {
    route('head', true, regex, re_params, "/foo/v0.1");
  },

  testTraceWithPattern: function() {
    route('trace', false, "/:name/:version", params, "/foo/v0.1");
  },

  testTraceWithRegEx: function() {
    route('trace', true, regex, re_params, "/foo/v0.1");
  },

  testPatchWithPattern: function() {
    route('patch', false, "/:name/:version", params, "/foo/v0.1");
  },

  testPatchWithRegEx: function() {
    route('patch', true, regex, re_params, "/foo/v0.1");
  },

  testConnectWithPattern: function() {
    route('connect', false, "/:name/:version", params, "/foo/v0.1");
  },

  testConnectWithRegEx: function() {
    route('connect', true, regex, re_params, "/foo/v0.1");
  },

  testAllWithPattern: function() {
    route('all', false, "/:name/:version", params, "/foo/v0.1");
  },

  testAllWithRegEx: function() {
    route('all', true, regex, re_params, "/foo/v0.1");
  },

  testRouteNoMatch: function() {
    server.listen(9999, '0.0.0.0', function(serv) {
      client.get('some-uri', function(resp) {
        vassert.assertTrue(404 === resp.statusCode());
        vassert.testComplete();
      }).end();
    });
  },

  testInterceptAll: function() {
    var count = 0
    var handler = function(req) {
      vassert.assertEquals(1, ++count)
      // Now call the request handler of the routematcher
      rm.call(req);
    }

    server.requestHandler(handler);

    rm.get("/:name/:version", function(req) {
      vassert.assertEquals(2, ++count);
      req.response.end();
    });

    server.listen(9999, '0.0.0.0', function(serv) {
      client.get("/foo/bar", function(resp) {
        vassert.assertEquals("200", resp.statusCode().toString())
        vassert.testComplete();
      }).end();
    });
  }

}

function route(method, regex, pattern, params, uri) {

  var handler = function(req) {
    for (k in req.params()) {
      vassert.assertTrue(params[k] === req.params().get(k));
    }
    req.response.end();
  }

  if (regex) {
    rm[method + 'WithRegEx'](pattern, handler);
  } else {
    rm[method](pattern, handler);
  }

  if (method === 'all') {
    method = 'get';
  }

  server.listen(9999, '0.0.0.0', function(serv) {
    client[method](uri, function(resp) {
      vassert.assertTrue(200 == resp.statusCode());
      vassert.testComplete();
    }).end();
  });
}

vertxTest.startTests(RouteMatcherTest);

function vertxStop() {
  server.close(function() {
    client.close();
  })
}

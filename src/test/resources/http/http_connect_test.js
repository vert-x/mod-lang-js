var vertx = require('vertx');
var vertxTest = require('vertx_tests');
var vassert = vertxTest.vassert;

var port = 9090
var server = vertx.http.createHttpServer();
var client = vertx.http.createHttpClient().port(port);

vertxTest.startTests( {
  testHttpCONNECT: function() {
    server.requestHandler(function(request) {
      vassert.assertEquals('CONNECT', request.method());
      request.response.statusCode(200);
      request.response.end();
    });
    server.listen(port, '0.0.0.0', function(err, srv) {
      vassert.assertTrue(err === null);
      var request = client.request('CONNECT', 'http://localhost:9090/some/path', function(resp) {
        resp.endHandler(function() {
          vassert.testComplete();
        });
      });
      request.end();
    });
  }
} );

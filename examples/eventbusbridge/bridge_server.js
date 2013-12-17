var vertx   = require('vertx');
var SockJS  = require('vertx/sockjs');
var console = require('vertx/console');
var server  = vertx.createHttpServer();

// Serve the static resources
server.requestHandler(function(req) {
  if (req.uri() == "/") req.response.sendFile("index.html");
  if (req.uri() == "/vertxbus.js") req.response.sendFile("vertxbus.js");
});

// Create a SockJS bridge which lets everything through (be careful!)
var sockjs = SockJS.createSockJSServer(server);
sockjs.bridge({prefix: "/eventbus"}, [{address: 'someaddress', match: {type: 'publish'}, requires_auth: true }], [{}]);


var events = ['socket-created',
              'socket-closed',
              'send-or-pub',
              'pre-register',
              'unregister',
              'authorize',
              'post-register'
              ];

events.map(function(evt) {
  console.log('Registering handler for: ' + evt);
  sockjs.on(evt, function(/* arguments */) {
    console.log('Handling Event: ' + evt);
    console.log('Args: ' + Array.prototype.slice.call(arguments).join(', '));
    return true;
  });
});

server.listen(8080);

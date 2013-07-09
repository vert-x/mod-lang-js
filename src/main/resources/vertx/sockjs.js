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

if (typeof __vertxload === 'string') {
  throw "Use require() to load Vert.x API modules"
}

/**
 * <p>
 * SockJS enables browsers to communicate with the server using a simple
 * WebSocket-like api for sending and receiving messages. Under the hood
 * SockJS chooses to use one of several protocols depending on browser
 * capabilities and what apppears to be working across the network.
 * </p>
 *
 * <p>
 * Available protocols include:
 * </p>
 *
 * <ul>
 *   <li>WebSockets</li>
 *   <li>xhr-polling</li>
 *   <li>xhr-streaming</li>
 *   <li>json-polling</li>
 *   <li>event-source</li>
 *   <li>html-file</li>
 * </ul>
 *
 * <p>
 * This means, it should <i>just work</i> irrespective of what browser is being
 * used, and whether there are nasty things like proxies and load balancers
 * between the client and the server.
 * </p>
 *
 * <p>
 * For more detailed information on SockJS, see their website.
 * </p>
 *
 * @exports vertx/sockjs
 */
var sockJS = {};

/**
 * Create a new SockJSServer
 * @param {module:vertx/http.HttpServer} httpServer the HTTP server to use
 * @return {module:vertx/sockjs.SockJSServer} the SockJS server instance
 */
sockJS.createSockJSServer = function(httpServer) {
  if (typeof httpServer._to_java_server !== 'function') {
    throw "Please construct a vertx.SockJSServer with an instance of vert.HttpServer"
  }
  return new sockJS.SockJSServer();
}

/**
 * <p>
 * This is an implementation of the server side part of 
 * <a href="https://github.com/sockjs">SockJS</a>.
 * </p>
 * <p>
 * You can register multiple applications with the same SockJSServer, each
 * using different path prefixes, each application will have its own handler,
 * and configuration.
 * </p>
 *
 * @constructor
 */
sockJS.SockJSServer = function() {
  var that    = this;
  var vertx   = __jvertx;
  var jserver = vertx.createSockJSServer(httpServer._to_java_server());

  /**
   * Install a SockJS application.
   * @param {JSON} config The application configuration
   * @param {SockJSHandler} handler The handler that will be called when SockJS sockets are created
   * @return {module:vertx/sockjs.SockJSServer} this
   */
  this.installApp = function(config, handler) {
    jserver.installApp(new org.vertx.java.core.json.JsonObject(JSON.stringify(config)), handler);
  }

  // TODO: This is broken. This should be hook() perhaps
  // this.seteventbusbridgelistener = function(bridgelistener) {
  //     jserver.seteventbusbridgelistener(new org.vertx.java.core.sockjs.eventbusbridgelistener(bridgelistener));
  //     return that;
  // }

    /**
   * Install an app which bridges the SockJS server to the event bus
   * @param {JSON} config The application configuration
   * @param {Array} inboundPermitted A list of JSON objects which define
   *                permitted matches for inbound (client->server) traffic 
   * @param {Array} outboundPermitted A list of JSON objects which define 
   *                permitted matches for outbound (server->client) traffic
   */
  this.bridge = function(config, inboundPermitted, outboundPermitted, authTimeout, authAddress) {
    if (typeof authTimeout === 'undefined') {
      authTimeout = 5 * 50 * 1000;
    }
    if (typeof authAddress === 'undefined') {
      authAddress = null;
    }
    var jInboundPermitted = convertPermitted(inboundPermitted);
    var jOutboundPermitted = convertPermitted(outboundPermitted);
    jserver.bridge(new org.vertx.java.core.json.JsonObject(JSON.stringify(config)),
        jInboundPermitted, jOutboundPermitted, authTimeout, authAddress);
  }

  function convertPermitted(permitted) {
    var json_arr = new org.vertx.java.core.json.JsonArray();
    for (var i = 0; i < permitted.length; i++) {
      var match = permitted[i];
      var json_str = JSON.stringify(match);
      var jJson = new org.vertx.java.core.json.JsonObject(json_str);
      json_arr.add(jJson);
    }
    return json_arr;
  }

}

/**
 * A <code>SockJSHandler</code> is a {@linkcode Handler} that responds to
 * notifications from objects in the <code>vertx/http</code> module and expects
 * an {@linkcode module:vertx/http.HttpServerRequest|HttpServerRequest} object
 * as its parameter.
 *
 * @example
 * var http = require('vertx/http');
 * var server = http.createHttpServer();
 *
 * server.requestHandler( function( request ) {
 *   // This function is executed for each
 *   // request event on our server
 * } );
 *
 * @see module:vertx/http.HttpServer#requestHandler
 * @typedef {function} SockJSHandler
 * @param {SockJSSocket} sockJSSocket The socket object
 */

/**
 * You interact with SockJS clients through instances of SockJS socket.
 * The API is very similar to {@linkcode module:vertx/http.WebSocket}.
 * It implements both {@linkcode ReadStream} and 
 * {@linkcode WriteStream} so it can be used with 
 * {@linkcode module:vertx/pump~Pump} to pump data with flow control.
 *
 * @see https://github.com/vert-x/vert.x/blob/master/vertx-core/src/main/java/org/vertx/java/core/sockjs/SockJSSocket.java
 * @external org.vertx.java.core.sockjs.SockJSSocket
 */

module.exports = sockJS;


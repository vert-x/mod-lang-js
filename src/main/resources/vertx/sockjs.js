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
  throw "Use require() to load Vert.x API modules";
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
var JsonObject   = org.vertx.java.core.json.JsonObject;
var JsonArray    = org.vertx.java.core.json.JsonArray;
var EventBusHook = org.vertx.java.core.sockjs.EventBusBridgeHook;

/**
 * Create a new SockJSServer
 * @param {module:vertx/http.HttpServer} httpServer the HTTP server to use
 * @return {module:vertx/sockjs.SockJSServer} the SockJS server instance
 */
sockJS.createSockJSServer = function(httpServer) {
  if (typeof httpServer._to_java_server !== 'function') {
    throw "Please construct a vertx.SockJSServer with an instance of vert.HttpServer";
  }
  return new sockJS.SockJSServer(httpServer);
};

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
 * <p>
 *    Configuration options and their defaults are:
 *    <pre>
 *      - session_timeout: 5000ms
 *      - insert_JSESSIONID: true
 *      - heartbeat_period: 25000ms
 *      - max_bytes_streaming: 131072 (128*1024)
 *      - prefix: "/"
 *      - library_url: "http://cdn.sockjs.org/sockjs-0.3.4.min.js"
 *      - disabled_transports: []
 *    </pre>
 *  </p>
 *
 *
 * @constructor
 */
sockJS.SockJSServer = function(httpServer) {
  var jserver = __jvertx.createSockJSServer(httpServer._to_java_server());
  var hooks   = {};

  /**
   * Specify a function to call on the given event. All functions take a
   * SockJSSocket as the first (and perhaps only) parameter.
   *
   *   - socket-created - Called when a new socket is created. Use this to do things like
   *     check the origin header on the socket before accepting it.
   *   - socket-closed - Called when the socket has been closed
   *   - send-or-pub - Called when a client is sending or publishing on the socket.
   *     Takes the following parameters in addition to the SockJSSocket:
   *     * {boolean} send True if client is sending, false if publishing
   *     * {JSON} message The message being sent
   *     * {string} address The address the message is being sent to
   *   - pre-register - Called before a client registers a handler. In addition to the
   *     SockJSSocket parameter, this also is given a string address as the second parameter.
   *   - post-register - Called after a client registers a handler. In addition to the
   *     SockJSSocket parameter, this also is given a string address as the second parameter.
   *   - unregister - Client is unregistering a handler. In addition to the SockJSSocket
   *     parameter, this is also given a string address as the second parameter.
   *   - authorize - Called before authorization. This function does not receive a SockJSSocket
   *     as its first parameter. The full list of parameters is:
   *     * {JSON} message The auth message
   *     * {string} sessionID The session ID
   *     * {ResultHandler} handler To be called when authorization is complete
   * @param {string} evt The name of the event as a string
   * @param {function} func The function to call
   */
  this.on = function(evt, func) {
    hooks[evt] = func;
  };

  /**
   * Install a SockJS application.
   * @param {JSON} config The application configuration
   * @param {SockJSHandler} handler The handler that will be called when SockJS sockets are created
   * @return {module:vertx/sockjs.SockJSServer} this
   */
  this.installApp = function(config, handler) {
    jserver.installApp(new JsonObject(JSON.stringify(config)), handler);
  };

  /**
   * Install an app which bridges the SockJS server to the event bus
   * @param {JSON} config The application configuration
   * @param {Array} inboundPermitted A list of JSON objects which define
   *                permitted matches for inbound (client->server) traffic 
   * @param {Array} outboundPermitted A list of JSON objects which define 
   *                permitted matches for outbound (server->client) traffic
   * @param {JSON} bridgeConfig A JSON object containing the configuration for
   *   the event bus bridge. Configuration options and their defaults are:
   *    <pre>
   *      auth_address: "vertx.basicauthmanager.authorise"
   *      auth_timeout: 300000ms
   *      ping_interval: 10000ms
   *      max_address_length: 200
   *      max_handlers_per_socket: 1000
   *    </pre>
   */
  this.bridge = function(config, inboundPermitted, outboundPermitted, bridgeConfig) {
    var jInboundPermitted = convertPermitted(inboundPermitted);
    var jOutboundPermitted = convertPermitted(outboundPermitted);

    var console = require('vertx/console');
    console.log(">>>>>>>>>>>> SETTING HOOK");
    jserver.setHook( new EventBusHook({
      handleSocketCreated: lookup('socket-created', true),
      handleSendOrPub:     lookup('send-or-pub',    true),
      handlePreRegister:   lookup('pre-register',   true),
      handleUnRegister:    lookup('unregister',     true),
      handleAuthorize:     lookup('authorize',      false),
      handlePostRegister:  lookup('post-register'),
      handleSocketClosed:  lookup('socket-closed'),
    }) );
    console.log(">>>>>>>>>>>> SET HOOK");

    if (bridgeConfig) {
      jserver.bridge(new JsonObject(JSON.stringify(config)),
            jInboundPermitted, jOutboundPermitted, bridgeConfig);
    } else {
      jserver.bridge(new JsonObject(JSON.stringify(config)),
            jInboundPermitted, jOutboundPermitted);
    }
  };

  function convertPermitted(permitted) {
    var json_arr = new JsonArray();
    for (var i = 0; i < permitted.length; i++) {
      json_arr.add(new JsonObject(JSON.stringify(permitted[i])));
    }
    return json_arr;
  }

  /**
   * Looks up the event bus bridge hook function for the given event
   * and if a function for the event does not exist, returns a default
   * @param {string} evt The event name, e.g. 'socket-created'
   * @param {object} [defaultReturn] The default return value if a function is not found
   * @private
   */
  function lookup(evt, defaultReturn) {
    return function(/* arguments */ ) {
      return (hooks[evt] ? hooks[evt].call(arguments) : defaultReturn);
    };
  }

};

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


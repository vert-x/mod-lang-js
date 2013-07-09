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
 * Message handlers receive event_bus messages as JSON.
 * @see module:vertx/event_bus
 * @typedef {JSON} JsonMessage
 */

/**
 * While JSON is the preferred messaging on the event bus,
 * you can send any basic type as a message, for example,
 * <code>string</code>, <code>boolean</code>, etc. can all be passed
 * directly into {@linkcode module:vertx/event_bus.send}. You may also
 * send {@linkcode module:vertx/buffer~Buffer}s and plain old 
 * Javascript objects. Objects will be converted to <code>JSON</code>
 * before being placed on the bus.
 * @see module:vertx/event_bus
 * @typedef {string|boolean|number|{}|module:vertx/buffer~Buffer} Message
 */

/**
 * A <code>MessageHandler</code> is a {@linkcode Handler} that responds to
 * messages on the {@linkcode module:vertx/event_bus} module. <code>MessageHandler</code>s
 * are called with a {@linkcode JsonMessage} object as the parameter.
 *
 * @see module:vertx/event_bus.registerHandler
 * @typedef {function} MessageHandler
 * @param {JsonMessage} message The JSON message
 */


/**
 * <p>Represents a distributed lightweight event bus which can encompass
 * multiple vert.x instances.  It is very useful for otherwise isolated vert.x
 * application instances to communicate with each other. Messages sent over the
 * event bus are JSON objects.</p>
 *
 * <p>The event bus implements a distributed publish / subscribe network.
 * Messages are sent to an address.  There can be multiple handlers registered
 * against that address.  Any handlers with a matching name will receive the
 * message irrespective of what vert.x application instance and what vert.x
 * instance they are located in.</p>
 *
 * <p>All messages sent over the bus are transient. On event of failure of all
 * or part of the event bus messages may be lost. Applications should be coded
 * to cope with lost messages, e.g. by resending them, and making application
 * services idempotent.</p>
 *
 * <p>The order of messages received by any specific handler from a specific
 * sender will match the order of messages sent from that sender.</p>
 *
 * <p>When sending a message, a reply handler can be provided. If so, it will
 * be called when the reply from the receiver has been received.</p>
 *
 * <p>This module can be used individually, or through the top-level
 * {@linkcode module:vertx|vertx} module.
 * 
 * @example <caption>Accessing the event bus</caption>
 *
 * var vertx = require('vertx');
 *
 * var eb1 = require('vertx/event_bus');
 * var eb2 = vertx.eventBus;
 *
 * eb1.registerHandler('some-address', function(message) {
 *   print("Got a message! " + message);
 * }
 * eb2.publish('some-address', 'Hello world');
 *
 * @exports vertx/event_bus
 */
var eventBus = {};

var handlerMap = {};

var jEventBus = __jvertx.eventBus();

/**
 * Register a handler which won't be propageted acress the cluster.
 *
 * @param {string} address the address to register for. Any messages sent to
 * that address will be received by the handler. A single handler can be
 * registered against many addresses.
 * @param {MessageHandler} handler The handler
 *
 * @returns {module:vertx/event_bus} The event bus
 */
eventBus.registerLocalHandler = function(address, handler) {
  registerHandler(address, handler, true);
  return eventBus;
};

/**
 * Register a handler.
 *
 * @param {string} address the address to register for. Any messages sent to
 * that address will be received by the handler. A single handler can be
 * registered against many addresses.
 * @param {MessageHandler} handler The handler
 *
 * @returns {module:vertx/event_bus} the event bus
 */
eventBus.registerHandler = function(address, handler) {
  registerHandler(address, handler, false);
  return eventBus;
};

/**
 * Unregisters a handler.
 *
 * @param {string} address The address the handler is registered to
 * @param {MessageHandler} handler The handler to unregister
 * @returns {module:vertx/event_bus} the event bus
 */
eventBus.unregisterHandler = function(address, handler) {
  checkHandlerParams(address, handler);
  var wrapped = handlerMap[handler];
  if (wrapped) {
    jEventBus.unregisterHandler(address, wrapped);
    delete handlerMap[handler];
  }
  return eventBus;
};

/**
 * Sends a message on the event bus.
 * Message should be a JSON object It should have a property "address"
 *
 * @param {string} address The address to send the message to
 * @param {Message} message The message to send
 * @param {MessageHandler} [replyHandler] called when the message receives a reply
 * @returns {module:vertx/event_bus}
 */
eventBus.send = function(address, message, replyHandler) {
  sendOrPub(true, address, message, replyHandler);
  return eventBus;
};

/**
 * Publish a message on the event bus.
 * Message should be a JSON object It should have a property "address".
 *
 * @param {string} address The address to send the message to
 * @param {Message} message The message to send
 * @returns {module:vertx/event_bus}
 */
eventBus.publish = function(address, message) {
  sendOrPub(false, address, message);
  return eventBus;
};

function checkHandlerParams(address, handler) {
  if (!address) {
    throw "address must be specified";
  }
  if (!handler) {
    throw "handler must be specified";
  }
  if (typeof address != "string") {
    throw "address must be a string";
  }
  if (typeof handler != "function") {
    throw "handler must be a function";
  }
}

var jsonObjectClass = new org.vertx.java.core.json.JsonObject().getClass();
var jsonArrayClass = new org.vertx.java.core.json.JsonArray().getClass();

function wrappedHandler(handler) {
  return new org.vertx.java.core.Handler({
    handle: function(jMsg) {
      var body = jMsg.body();

      if (typeof body === 'object') {
        var clazz = body.getClass();
        if (clazz === jsonObjectClass || clazz === jsonArrayClass) {
          // Convert to JS JSON
          if (body) {
            body = JSON.parse(body.encode());
          } else {
            body = undefined;
          }
        }
      } else if (body && typeof body === 'org.vertx.java.core.json.JsonObject') {
        // DynJS returns a fully qualified class name for `typeof` on most
        // java objects, so we need to check for this too.
        body = JSON.parse(body.encode());
      }

      handler(body, function(reply, replyHandler) {
        if (typeof reply === 'undefined') {
          throw "Reply message must be specified";
        }
        reply = convertMessage(reply);
        if (replyHandler) {
          var wrapped = wrappedHandler(replyHandler);
          jMsg.reply(reply, wrapped);
        } else {
          jMsg.reply(reply);
        }
      })
    }
  });
}

function registerHandler(address, handler, localOnly) {
  checkHandlerParams(address, handler);

  var wrapped = wrappedHandler(handler);

  // This is a bit more complex than it should be because we have to wrap the
  // handler - therefore we have to keep track of it :(
  handlerMap[handler] = wrapped;

  if (localOnly) {
    jEventBus.registerLocalHandler(address, wrapped);
  } else {
    jEventBus.registerHandler(address, wrapped);
  }
  return eventBus;
}

function convertMessage(message) {
  var msgType = typeof message;
  switch (msgType) {
    case 'string':
    case 'boolean':
    case 'undefined':
    case 'org.vertx.java.core.buffer.Buffer':
      break;
    case 'number':
      message = new java.lang.Double(message);
      break;
    case 'object':
      // If null then we just wrap it as an empty JSON message
      // We don't do this if it's a Java class (it has the getClass) method
      // since it may be a Buffer which we want to let through
      if (message == null || typeof message.getClass === "undefined") {
        // Not a Java object - assume JSON message
        message = new org.vertx.java.core.json.JsonObject(JSON.stringify(message));
      }
      break;
    default:
      throw 'Invalid type for message: ' + msgType;
  }
  return message;
}

function sendOrPub(send, address, message, replyHandler) {
  if (!address) {
    throw "address must be specified";
  }
  if (typeof address !== "string") {
    throw "address must be a string";
  }
  if (replyHandler && typeof replyHandler !== "function") {
    throw "replyHandler must be a function";
  }
  message = convertMessage(message);
  if (send) {
    if (replyHandler) {
      var wrapped = wrappedHandler(replyHandler);
      jEventBus.send(address, message, wrapped);
    } else {
      jEventBus.send(address, message);
    }
  } else {
    jEventBus.publish(address, message);
  }
  return eventBus;
}

module.exports = eventBus;


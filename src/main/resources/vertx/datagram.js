/**
 * Copyright 2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
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
 * This module provides classes for UDP networking.
 *
 * @module vertx/datagram
 */


var streams = require('vertx/streams');
var NetworkSupport = require('vertx/network_support');

load("vertx/helpers.js");

/**
 * <p>
 * A socket which can be used to send and receive {@linkcode module:vertx/datagram~DatagramPacket}s 
 * </p>
 *
 * <p>
 * UDP is connectionless which means you are not connected to the remote peer
 * in a persistent way. Because of this you have to supply the address and port
 * of the remote peer when sending data.  You can send data to ipv4 or ipv6
 * addresses, which also include multicast addresses.
 * </p>
 * @constructor
 * @augments module:vertx/streams~ReadSupport
 * @augments module:vertx/streams~DrainSupport
 * @augments module:vertx/network_support
 * @param {boolean} ipv4 If true, use IPv4 addresses, if false use IPv6 addresses,
 * if undefined, use the operating system default.
 */
DatagramSocket = function(ipv4) {
  var family = null;
  if(ipv4 === true) {
    family = org.vertx.java.core.datagram.InternetProtocolFamily.IPv4;
  } else if (ipv4 === false) {
    family = org.vertx.java.core.datagram.InternetProtocolFamily.IPv6;
  }

  var _delegate = __jvertx.createDatagramSocket(family);
  var _localAddress = _delegate.localAddress(); // TODO: Make this a JS object
  var _that     = this;

  streams.ReadSupport.call(this, _delegate);
  streams.DrainSupport.call(this, _delegate);
  NetworkSupport.call(this, _delegate);

  /**
   * Writes a packet to the host and port provided, calling the handler
   * when the write has completed. If an encoding is supplied, the packet's
   * toString function is called and the specified encoding is used.
   *
   * @param {string} host the network host address of the remote peer
   * @param {number} port the network port of the remote peer
   * @param {string|module:vertx/buffer} packet the packet to write
   * @param {ResultHandler} handler the handler to notify when the write completes
   * @param {string} [encoding] the encoding to use when writing a string packet
   */
  this.send = function(host, port, packet, handler, encoding) {
    if (encoding !== undefined) {
      _delegate.send(packet.toString(), encoding, host, port, adaptAsyncResultHandler(handler, function() { return _that; }));
    } else {
      _delegate.send(packet, host, port, adaptAsyncResultHandler(handler, function() { return _that; }));
    }
    return this;
  }

  /**
   * Get or set the SO_BROADCAST option
   * @param {boolean} [value] turns on or off the SO_BROADCAST option
   * @return {boolean} the SO_BROADCAST option as currently set
   */
  this.broadcast = function(value) {
    if (value !== undefined) {
      _delegate.setBroadcast(value);
    }
    return _delegate.isBroadcast();
  }

  /**
   * Get or set the IP_MULTICAST_LOOP option
   * @param {boolean} [value] turns on or off the IP_MULTICAST_LOOP option
   * @return {boolean} the IP_MULTICAST_LOOP option as currently set
   */
  this.multicastLoopbackMode = function(value) {
    if (value !== undefined) {
      _delegate.setMulticastLoopbackMode(value);
    }
    return _delegate.isMulticastLoopbackMode();
  }

  /**
   * Get or set the IP_MULTICAST_TTL option
   * @param {number} [value] the IP_MULTICAST_TTL value
   * @return {number} the IP_MULTICAST_TTL option as currently set
   */
  this.multicastTimeToLive = function(value) {
    if (value !== undefined) {
      _delegate.setMulticastTimeToLive(value);
    }
    return _delegate.getMulticastTimeToLive();
  }

  /**
   * Get or set the IP_MULTICAST_IF option
   * @param {string} [value] the IP_MULTICAST_IF value
   * @return {string} the IP_MULTICAST_IF option as currently set
   */
  this.multicastNetworkInterface = function(value) {
    if (value !== undefined) {
      _delegate.setMulticastNetworkInterface(value);
    }
    return _delegate.getMulticastNetworkInterface();
  }

  /**
   * Close the {@linkcode module:vertx/datagram~DatagramSocket} asynchronously
   * and notify the handler when complete.
   * @param {ResultHandler} handler the handler to notify when close() has completed.
   */
  this.close = function(handler) {
    if (handler !== undefined) {
      _delegate.close(adaptAsyncResultHandler(handler));
    } else {
      _delegate.close();
    }
  }

  /** 
   * Get the local address of this socket. 
   * TODO: Return a javascript object.
   * @return {external:InetSocketAddress}
   */
  this.local_address = function() {
    return _localAddress;
  }
}

module.exports.DatagramSocket = DatagramSocket;

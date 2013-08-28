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

// handler wrapper
load("vertx/helpers.js");

// TODO: WRAP JAVA LISTS IN ASYNC RESULT HANDLERS

/**
 * @exports vertx/dns
 */
var dns = {
  /**
   * Creates and returns a DNS client object
   *
   * @param {Array|string} [servers] The DNS server address(es). If not supplied, defaults
   *        to Google DNS servers 8.8.8.8 and 8.8.4.4
   *        TODO: Figure out proper default behavior
   * @returns {DnsClient} A DnsClient object 
   */
  createDnsClient: function(servers) {
    if (typeof servers == 'undefined') {
      servers = '8.8.8.8';
    }
    return new DnsClient(servers);
  },
};

var DnsClient = function(servers) {
  var that = this;

  var wrapIpAddresses = function(addresses) {
    if (typeof addresses === 'string') {
      return [new java.net.InetSocketAddress(java.net.InetAddress.getByName(addresses), 53)];
    } else {
      // TODO: Be smarter about what's passed in
      return [addresses];
    }
  }

  this.lookup = function(name, handler) {
    __jClient.lookup(name, adaptAsyncResultHandler(handler));
    return that;
  }

  this.lookup4 = function(name, handler) {
    __jClient.lookup4(name, adaptAsyncResultHandler(handler));
    return that;
  }

  this.lookup6 = function(name, handler) {
    __jClient.lookup6(name, adaptAsyncResultHandler(handler));
    return that;
  },

  this.resolveNS = function(name, handler) {
    __jClient.resolveNS(name, adaptAsyncResultHandler(handler));
    return that;
  }

  this.resolveTXT = function(name, handler) {
    __jClient.resolveTXT(name, adaptAsyncResultHandler(handler));
    return that;
  }

  this.resolveMX = function(name, handler) {
    __jClient.resolveMX(name, adaptAsyncResultHandler(handler));
    return that;
  }

  this.resolveA = function(name, handler) {
    __jClient.resolveA(name, adaptAsyncResultHandler(handler));
    return that;
  }

  this.resolveAAAA = function(name, handler) {
    __jClient.resolveAAAA(name, adaptAsyncResultHandler(handler));
    return that;
  }

  this.resolveCNAME = function(name, handler) {
    __jClient.resolveCNAME(name, adaptAsyncResultHandler(handler));
    return that;
  }

  this.resolvePTR = function(name, handler) {
    __jClient.resolvePTR(name, adaptAsyncResultHandler(handler));
    return that;
  }

  this.resolveSRV = function(name, handler) {
    __jClient.resolveSRV(name, adaptAsyncResultHandler(handler));
    return that;
  }

  var __jClient = __jvertx.createDnsClient(wrapIpAddresses(servers));
}

module.exports = dns;


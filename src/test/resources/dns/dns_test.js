/*
 * Copyright 2013 Red Hat, Inc.
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

var dns = require('vertx/dns');
var vertxTest = require("vertx_tests");
var vassert = vertxTest.vassert;

var DnsServer = org.vertx.testtools.TestDnsServer
var server = null; // server instance set in prepareDns

// Debugging
var console = require('vertx/console');

function prepareDns(srv, testFunc) {
  server = srv
  server.start();
  testFunc( dns.createDnsClient( server.getTransports()[0].getAcceptor().getLocalAddress() ) );
}

DNSTest = {
  testCreateDnsClient: function() {
    var ip = '10.0.0.1'
    prepareDns(DnsServer.testResolveA(ip), function(client) {
      vassert.assertTrue("Can't create DnsClient", typeof client === 'object');
      vassert.testComplete();
    });
  },

  testLookup: function() {
    var ip = '10.0.0.1'
    prepareDns(DnsServer.testResolveA(ip), function(client) {
      client.lookup("vertx.io", function(err, address) {
        vassert.assertNotNull(address);
        vassert.assertTrue("Unexpected address: " + address.getHostAddress(), ip === address.getHostAddress());
        vassert.testComplete();
      });
    });
  },

  testLookup4: function() {
    var ip = '10.0.0.1'
    prepareDns(DnsServer.testResolveA(ip), function(client) {
      client.lookup4("vertx.io", function(err, address) {
        vassert.assertNotNull(address);
        vassert.assertTrue("Unexpected address: " + address.getHostAddress(), ip === address.getHostAddress());
        vassert.testComplete();
      });
    });
  },

  testLookup6: function() {
    prepareDns(DnsServer.testLookup6(), function(client) {
      client.lookup6("vertx.io", function(err, address) {
        vassert.assertNotNull(address);
        vassert.assertTrue("Unexpected address: "+address.getHostAddress(), '0:0:0:0:0:0:0:1' === address.getHostAddress());
        vassert.testComplete();
      });
    });
  },

  testLookupNonexisting: function() {
    prepareDns(DnsServer.testLookupNonExisting(), function(client) {
      client.lookup("asdfadsf.com", function(err, address) {
        vassert.assertNotNull(err);
        vassert.testComplete();
      });
    });
  },

  testResolveNS: function() {
    var ns = 'ns.vertx.io'
    prepareDns(DnsServer.testResolveNS(ns), function(client) {
      client.resolveNS("vertx.io", function(err, records) {
        vassert.assertTrue("Unexpected number of response records: " + records.size(), 1 === records.size());
        vassert.assertTrue("Unexpected result: " + records.get(0), ns === records.get(0));
        vassert.testComplete();
      });
    });
  },

  testResolveTxt: function() {
    var txt = "vert.x is awesome"
    prepareDns(DnsServer.testResolveTXT(txt), function(client) {
      client.resolveTXT("vertx.io", function(err, records) {
        vassert.assertTrue("Unexpected number of response records: " + records.size(), 1 === records.size());
        vassert.assertTrue("Unexpected result: " + records.get(0), txt === records.get(0));
        vassert.testComplete();
      });
    });
  },

  testResolveMx: function() {
    var prio = 10,
        name = "mail.vertx.io"
    prepareDns(DnsServer.testResolveMX(prio, name), function(client) {
      client.resolveMX("vertx.io", function(err, records) {
        vassert.assertTrue("Unexpected number of response records: " + records.size(), 1 === records.size());
        // Returns a Java MxRecord
        record = records.get(0);
        vassert.assertTrue("Unexpected result: " + record.priority(), prio == record.priority());
        vassert.assertTrue("Unexpected result: " + record.name(), name === record.name());
        vassert.testComplete();
      });
    });
  },

  testResolveA: function() {
    var ip = '10.0.0.1'
    prepareDns(DnsServer.testResolveA(ip), function(client) {
      client.resolveA("vertx.io", function(err, records) {
        vassert.assertNotNull(records);
        // Returns a Java Inet4Address
        record = records.get(0);  
        vassert.assertTrue("Unexpected address: " + record.getHostAddress(), ip === record.getHostAddress());
        vassert.testComplete();
      });
    });
  },

  testResolveAAAA: function() {
    var ip = '::1'
    prepareDns(DnsServer.testResolveAAAA(ip), function(client) {
      client.resolveAAAA("vertx.io", function(err, records) {
        vassert.assertNotNull(records);
        // Returns a Java Inet4Address
        record = records.get(0);  
        vassert.assertTrue("Unexpected number of response records: " + records.size(), 1 === records.size());
        vassert.assertTrue("Unexpected address: " + record.getHostAddress(), '0:0:0:0:0:0:0:1' === record.getHostAddress());
        vassert.testComplete();
      });
    });
  },

  testResolveCNAME: function() {
    var cname = "cname.vertx.io"
    prepareDns(DnsServer.testResolveCNAME(cname), function(client) {
      client.resolveCNAME("vertx.io", function(err, records) {
        vassert.assertNotNull(records);
        // Returns a string
        record = records.get(0);  
        vassert.assertTrue("Unexpected address: " + record, cname === record);
        vassert.testComplete();
      });
    });
  },

  testResolvePTR: function() {
    var ptr = "ptr.vertx.io"
    prepareDns(DnsServer.testResolvePTR(ptr), function(client) {
      client.resolvePTR("10.0.0.1.in-addr.arpa", function(err, record) {
        vassert.assertNotNull(record);
        vassert.assertTrue("Unexpected address: " + record, ptr === record);
        vassert.testComplete();
      });
    });
  },

  testResolveSRV: function() {
    var prio = 10,
        weight = 1,
        port = 80,
        target = 'vertx.io'
    prepareDns(DnsServer.testResolveSRV(prio, weight, port, target), function(client) {
      client.resolveSRV("vertx.io", function(err, records) {
        vassert.assertNotNull(records);
        // Returns an SRV record
        record = records.get(0);  
        vassert.assertTrue("Unexpected value: " + record.priority(), prio == record.priority());
        vassert.assertTrue("Unexpected value: " + record.weight(), weight == record.weight());
        vassert.assertTrue("Unexpected value: " + record.port(), port == record.port());
        vassert.assertTrue("Unexpected address: " + record.target(), target === record.target());

        vassert.testComplete();
      });
    });
  },

  testReverseLookupIPv4: function() {
    var ptr = 'ptr.vertx.io';
    prepareDns(DnsServer.testReverseLookup(ptr), function(client) {
      client.reverseLookup('10.0.0.1', function(err, record) {
        vassert.assertNotNull(record);
        vassert.assertTrue("Unexpected address: " + record.getHostName(), record.getHostName() === ptr);
        vassert.testComplete();
      });
    });
  },

  testReverseLookupIPv6: function() {
    var ptr = 'ptr.vertx.io';
    prepareDns(DnsServer.testReverseLookup(ptr), function(client) {
      client.reverseLookup('::1', function(err, record) {
        vassert.assertNotNull(record);
        vassert.assertTrue("Unexpected address: " + record.getHostName(), record.getHostName() === ptr);
        vassert.testComplete();
      });
    });
  },

}

vertxTest.startTests(DNSTest);

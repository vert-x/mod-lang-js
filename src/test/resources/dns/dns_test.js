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

var DnsServer = org.vertx.lang.js.integration.TestDnsServer;

// Debugging
var console = require('vertx/console');

function prepareDns(store, testFunc) {
  var dnsServer =  new DnsServer(store);
  dnsServer.start();
  testFunc( dns.createDnsClient(dnsServer.getLocalAddress()) );
}

DNSTest = {
  testCreateDnsClient: function() {
    prepareDns(DnsServer.aRecordStore(), function(client) {
      vassert.assertTrue("Can't create DnsClient", typeof client === 'object');
      vassert.testComplete();
    });
  },

  testLookup: function() {
    prepareDns(DnsServer.aRecordStore(), function(client) {
      client.lookup("vertx.io", function(err, address) {
        vassert.assertNotNull(address);
        vassert.assertTrue("Unexpected address: " + address.getHostAddress(), "10.0.0.1" === address.getHostAddress());
        vassert.testComplete();
      });
    });
  },

  testLookup4: function() {
    prepareDns(DnsServer.aRecordStore(), function(client) {
      client.lookup4("vertx.io", function(err, address) {
        vassert.assertNotNull(address);
        vassert.assertTrue("Unexpected address: " + address.getHostAddress(), "10.0.0.1" === address.getHostAddress());
        vassert.testComplete();
      });
    });
  },

  testLookupNonexisting: function() {
    prepareDns(DnsServer.nullRecordStore(), function(client) {
      client.lookup("asdfadsf.com", function(err, address) {
        vassert.assertNotNull(err);
        vassert.testComplete();
      });
    });
  },

  testResolveNS: function() {
    prepareDns(DnsServer.nsRecordStore(), function(client) {
      client.resolveNS("vertx.io", function(err, records) {
        vassert.assertTrue("Unexpected number of response records: " + records.size(), 1 === records.size());
        vassert.assertTrue("Unexpected result: " + records.get(0), "ns.vertx.io" === records.get(0));
        vassert.testComplete();
      });
    });
  },

  testResolveTxt: function() {
    prepareDns(DnsServer.txtRecordStore(), function(client) {
      client.resolveTXT("vertx.io", function(err, records) {
        vassert.assertTrue("Unexpected number of response records: " + records.size(), 1 === records.size());
        vassert.assertTrue("Unexpected result: " + records.get(0), "vertx is awesome" === records.get(0));
        vassert.testComplete();
      });
    });
  },

  testResolveMx: function() {
    prepareDns(DnsServer.mxRecordStore(), function(client) {
      client.resolveMX("vertx.io", function(err, records) {
        vassert.assertTrue("Unexpected number of response records: " + records.size(), 1 === records.size());
        // Returns a Java MxRecord
        record = records.get(0);
        vassert.assertTrue("Unexpected result: " + record.priority(), 10 == record.priority());
        vassert.assertTrue("Unexpected result: " + record.name(), "mail.vertx.io" === record.name());
        vassert.testComplete();
      });
    });
  },

  testResolveA: function() {
    prepareDns(DnsServer.aRecordStore(), function(client) {
      client.resolveA("vertx.io", function(err, records) {
        vassert.assertNotNull(records);
        // Returns a Java Inet4Address
        record = records.get(0);  
        vassert.assertTrue("Unexpected address: " + record.getHostAddress(), "10.0.0.1" === record.getHostAddress());
        vassert.testComplete();
      });
    });
  },

}

vertxTest.startTests(DNSTest);

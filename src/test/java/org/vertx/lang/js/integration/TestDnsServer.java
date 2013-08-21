package org.vertx.lang.js.integration;
/*
 * Copyright 2013 Red Hat, Inc.
 *
 * Red Hat licenses this file to you under the Apache License, version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * @author <a href="http://lanceball.com">Lance Ball</a>
 */


import org.apache.directory.server.dns.DnsServer;
import org.apache.directory.server.dns.messages.*;
import org.apache.directory.server.dns.protocol.DnsProtocolHandler;
import org.apache.directory.server.dns.store.DnsAttribute;
import org.apache.directory.server.dns.store.RecordStore;
import org.apache.directory.server.protocol.shared.transport.UdpTransport;
import org.apache.mina.transport.socket.DatagramAcceptor;
import org.apache.mina.transport.socket.DatagramSessionConfig;

import java.io.IOException;
import java.net.SocketAddress;
import java.util.HashSet;
import java.util.Set;

/**
 * Simple DNS server for integration testing
 */
public class TestDnsServer extends DnsServer {
    private final RecordStore store;

    public TestDnsServer(RecordStore store) {
      this.store = store;
    }

    @Override
    public void start() throws IOException {
      UdpTransport transport = new UdpTransport("127.0.0.1", 53530);
      setTransports( transport );

      DatagramAcceptor acceptor = transport.getAcceptor();

      // Set the handler
      acceptor.setHandler( new DnsProtocolHandler(this, store));

      // Allow the port to be reused even if the socket is in TIME_WAIT state
      ((DatagramSessionConfig)acceptor.getSessionConfig()).setReuseAddress( true );

      // Start the listener
      acceptor.bind();
    }

    public SocketAddress getLocalAddress() {
        return getTransports()[0].getAcceptor().getLocalAddress();
    }

    public static RecordStore aRecordStore() {
        return new RecordStore() {
          @Override
          public Set<ResourceRecord> getRecords(QuestionRecord questionRecord) throws org.apache.directory.server.dns.DnsException {
            Set<ResourceRecord> set = new HashSet<>();

            ResourceRecordModifier rm = new ResourceRecordModifier();
            rm.setDnsClass(RecordClass.IN);
            rm.setDnsName("dns.vertx.io");
            rm.setDnsTtl(100);
            rm.setDnsType(RecordType.A);
            rm.put(DnsAttribute.IP_ADDRESS, "10.0.0.1");

            set.add(rm.getEntry());
            return set;
          }
        };
    }

    public static RecordStore nullRecordStore() {
        return new RecordStore() {
              @Override
              public Set<ResourceRecord> getRecords(QuestionRecord questionRecord) throws org.apache.directory.server.dns.DnsException {
                  return null;
              }
            };
    }

    public static RecordStore nsRecordStore() {
        return new RecordStore() {
          @Override
          public Set<ResourceRecord> getRecords(QuestionRecord questionRecord) throws org.apache.directory.server.dns.DnsException {
            Set<ResourceRecord> set = new HashSet<>();

            ResourceRecordModifier rm = new ResourceRecordModifier();
            rm.setDnsClass(RecordClass.IN);
            rm.setDnsName("dns.vertx.io");
            rm.setDnsTtl(100);
            rm.setDnsType(RecordType.NS);
            rm.put(DnsAttribute.DOMAIN_NAME, "ns.vertx.io");
            set.add(rm.getEntry());
            return set;
          }
        };
    }

    public static RecordStore mxRecordStore() {
        return new RecordStore() {
          @Override
          public Set<ResourceRecord> getRecords(QuestionRecord questionRecord) throws org.apache.directory.server.dns.DnsException {
              Set<ResourceRecord> set = new HashSet<>();

              ResourceRecordModifier rm = new ResourceRecordModifier();
              rm.setDnsClass(RecordClass.IN);
              rm.setDnsName("dns.vertx.io");
              rm.setDnsTtl(100);
              rm.setDnsType(RecordType.MX);
              rm.put(DnsAttribute.MX_PREFERENCE, String.valueOf(10));
              rm.put(DnsAttribute.DOMAIN_NAME, "mail.vertx.io");
              set.add(rm.getEntry());
              return set;
          }
        };
    }

    public static RecordStore txtRecordStore() {
        return new RecordStore() {
          @Override
          public Set<ResourceRecord> getRecords(QuestionRecord questionRecord) throws org.apache.directory.server.dns.DnsException {
              Set<ResourceRecord> set = new HashSet<>();

              ResourceRecordModifier rm = new ResourceRecordModifier();
              rm.setDnsClass(RecordClass.IN);
              rm.setDnsName("dns.vertx.io");
              rm.setDnsTtl(100);
              rm.setDnsType(RecordType.TXT);
              rm.put(DnsAttribute.CHARACTER_STRING, "vertx is awesome");
              set.add(rm.getEntry());
              return set;
          }
        };
    }

}

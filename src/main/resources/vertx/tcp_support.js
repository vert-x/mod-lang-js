tcpSupport = function(server, jserver) {
  /**
   * Provides TCP support functions to network objects. Do not use this object directly.
   * @see module:vertx.net
   * @see module:vertx.http
   * @mixin
   */
  TCPSupport = {
    /**
     * Set or get the TCP no delay value.
     * @param {boolean} [nodelay] If provided, set the value; if not, returns the current value.
     * @return {boolean|{{}}} the value or this
     */
    tcpNoDelay: function(nodelay) {
      if (nodelay === undefined) {
        return jserver.isTCPNoDelay();
      } else {
        jserver.setTCPNoDelay(nodelay);
        return server;
      }
    },

    /**
     * Set or get the send buffer size
     * @param {number} [size] If provided, set the value; if not, returns the current value.
     * @return {number|{{}}} the value or this
     */
    sendBufferSize: function(size) {
      if (size === undefined) {
        return jserver.getSendBufferSize();
      } else {
        jserver.setSendBufferSize(size);
        return server;
      }
    },

    /**
     * Set or get the receive buffer size
     * @param {number} [size] If provided, set the value; if not, returns the current value.
     * @return {number|{{}}} the value or this
     */
    receiveBufferSize: function(size) {
      if (size === undefined) {
        return jserver.getReceiveBufferSize();
      } else {
        jserver.setReceiveBufferSize(size);
        return server;
      }
    },

    /**
     * Set or get the TCP keep-alive value
     * @param {boolean} [keepAlive] If provided, set the value; if not, returns the current value.
     * @return {boolean|{{}}} the value or this
     */
    tcpKeepAlive: function(keepAlive) {
      if (keepAlive === undefined) {
        return jserver.isTCPKeepAlive();
      } else {
        jserver.setTCPKeepAlive(keepAlive);
        return server;
      }
    },

    /**
     * Set or get the TCP reuse address value
     * @param {boolean} [reuse] If provided, set the value; if not, returns the current value.
     * @return {boolean|{{}}} the value or this
     */
    reuseAddress: function(reuse) {
      if (reuse === undefined) {
        return jserver.isReuseAddress();
      } else {
        jserver.setReuseAddress(reuse);
        return server;
      }
    },

    /**
     * Set or get the TCP so linger value
     * @param {boolean} [linger] If provided, set the value; if not, returns the current value.
     * @return {boolean|{{}}} the value or this
     */
    soLinger: function(linger) {
      if (linger === undefined) {
        return jserver.isSoLinger();
      } else {
        jserver.setSoLinger(linger);
        return server;
      }
    },
    
    /**
     * Set or get the TCP traffic class
     * @param {number} [class] If provided, set the value; if not, returns the current value.
     * @return {number|{{}}} the value or this
     */
    trafficClass: function(cls) {
      if (cls === undefined) {
        return jserver.getTrafficClass();
      } else {
        jserver.setTrafficClass(cls);
        return server;
      }
    },

    /**
     * Set or get if vertx should use pooled buffers for performance reasons.
     * Doing so will give the best throughput but may need a bit higher memory
     * footprint.
     * @param {boolean} [use] If provided, set the value; if not, returns the current value.
     * @return {boolean|{{}}} the value or this
     */
    usePooledBuffers: function(use) {
      if (use === undefined) {
        return jserver.isUsedPooledBuffers();
      } else {
        jserver.setUsePooledBuffers(use);
        return server;
      }
    }
  }
  server.tcpNoDelay           = TCPSupport.tcpNoDelay;
  server.sendBufferSize       = TCPSupport.sendBufferSize;
  server.receiveBufferSize    = TCPSupport.receiveBufferSize;
  server.tcpKeepAlive         = TCPSupport.tcpKeepAlive;
  server.reuseAddress         = TCPSupport.reuseAddress;
  server.soLinger             = TCPSupport.soLinger;
  server.trafficClass         = TCPSupport.trafficClass;
  server.usePooledBuffers     = TCPSupport.usePooledBuffers;
}

serverTcpSupport = function(server, jserver) {
  /**
   * Provides server-side-only TCP support functions. Do not use this object directly.
   * @mixin 
   * @see module:vertx/net
   * @see module:vertx/http
   */
  ServerTCPSupport = {

    /**
     * Set or get the server's accept backlog
     * @param {number} [backlog] If provided, set the value; if not, returns the current value.
     * @return {number|{{}}} the value or this
     */
    acceptBacklog: function(backlog) {
      if (backlog === undefined) {
        return jserver.getAcceptBacklog();
      } else {
        jserver.setAcceptBacklog(backlog);
        return server;
      }
    }
  }
  server.acceptBacklog = ServerTCPSupport.acceptBacklog;
}

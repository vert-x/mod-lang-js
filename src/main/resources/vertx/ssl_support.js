sslSupport = function(jsObj, jObj) {
  /**
   * SSL support functions for network objects. Do not use this object directly.
   * These functions are mixed into the network objects for you.
   *
   * @see module:vertx/net.NetServer
   * @see module:vertx/net.NetClient
   * @see module:vertx/http.HttpServer
   * @see module:vertx/http.HttpClient
   * @mixin
   */
  SSLSupport = {
    /**
     * Get or set the current SSL support for this object.
     * @param {boolean} [ssl] If provided, sets whether this object supports SSL
     * @return {boolean|{}} the current status, or <code>this</code>.
     */
    ssl: function(ssl) {
      if (ssl === undefined) {
        return jObj.isSSL();
      } else {
        jObj.setSSL(ssl);
        return jsObj;
      }
    },

    /**
     * Get or set the current keystore path for this object.
     * @param {string} [path] If provided, sets the keystore path
     * @return {boolean|{}} the current path, or <code>this</code>.
     */
    keyStorePath: function(path) {
      if (path === undefined) {
        return jObj.getKeyStorePath();
      } else {
        jObj.setKeyStorePath(path);
        return jsObj;
      }
    },

    /**
     * Get or set the current keystore password for this object.
     * @param {string} [password] If provided, sets the keystore password
     * @return {boolean|{}} the current password, or <code>this</code>.
     */
    keyStorePassword: function(password) {
      if (password === undefined) {
        return jObj.getKeyStorePassword();
      } else {
        jObj.setKeyStorePassword(password);
        return jsObj;
      }
    },

    /**
     * Get or set the current trust store path for this object.
     * @param {string} [path] If provided, sets the trust store path
     * @return {boolean|{}} the current path, or <code>this</code>.
     */
    trustStorePath: function(path) {
      if (path === undefined) {
        return jObj.getTrustStorePath();
      } else {
        jObj.setTrustStorePath(path);
        return jsObj;
      }
    },

    /**
     * Get or set the current trust store password for this object.
     * @param {string} [password] If provided, sets the trust store password
     * @return {boolean|{}} the current password, or <code>this</code>.
     */
    trustStorePassword: function(password) {
      if (password === undefined) {
        return jObj.getTrustStorePassword();
      } else {
        jObj.setTrustStorePassword(password);
        return jsObj;
      }
    }
  }
  jsObj.ssl                = SSLSupport.ssl;
  jsObj.keyStorePath       = SSLSupport.keyStorePath;
  jsObj.keyStorePassword   = SSLSupport.keyStorePassword;
  jsObj.trustStorePath     = SSLSupport.trustStorePath;
  jsObj.trustStorePassword = SSLSupport.trustStorePassword;
}

serverSslSupport = function(jsObj, jObj) {
  /**
   * Provides functions for server-side SSL support. Do not use this object directly.
   * @see module:vertx/net.NetServer
   * @see module:vertx/http.HttpServer
   * @mixin
   */
  ServerSSLSupport = {
    /**
     * Get or set whether client authorization is required
     * @param {boolean} [required] If provided, sets whether client authorization is required
     * @return {boolean|{{}}} the current status, or <code>this</code>
     */
    clientAuthRequired: function(required) {
      if (required === undefined) {
        return jObj.isClientAuthRequired();
      } else {
        jObj.setClientAuthRequired(required);
        return jsObj;
      }
    }
  }
  jsObj.clientAuthRequired = ServerSSLSupport.clientAuthRequired;
}

clientSslSupport = function(jsObj, jObj) {
  /**
   * Provides functions for server-side SSL support. Do not use this object directly.
   * @see module:vertx/net.NetClient
   * @see module:vertx/http.HttpClient
   * @mixin
   */
  ClientSSLSupport = {
    /**
     * Get or set the trustAll SSL attribute
     * @param {boolean} [all] If provided, sets the trustAll attribute
     * @return {boolean|{{}}} the current trustAll status, or <code>this</code>
     */
    trustAll: function(all) {
      if (all === undefined) {
        return jObj.isTrustAll();
      } else {
        jObj.setTrustAll(all);
        return jsObj;
      }
    }
  }
  jsObj.trustAll = ClientSSLSupport.trustAll;
}

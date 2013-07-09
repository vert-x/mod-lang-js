readStream = function(jsObj, jObj) {
  /**
   * This provides methods to read from a data stream. It's used by things
   * like AsyncFile and HttpServerResponse and is not meant to be used
   * directly.
   * @mixin
   */
  ReadStream = {
    /**
     * Set a data handler. As data is read, the handler will be called with 
     * a Buffer containing the data read.
     * @param {BodyHandler} handler the handler to call
     */
    dataHandler: function(handler) {
      jObj.dataHandler(handler);
      return jsObj;
    },
    /**
     * Pause the <code>ReadStream</code>. While the stream is paused, no data
     * will be sent to the data Handler
     */
    pause: function() {
      jObj.pause();
      return jsObj;
    },
    /**
     * Resume reading. If the <code>ReadStream</code> has been paused, reading
     * will recommence on it.
     */
    resume: function() {
      jObj.resume();
      return jsObj;
    },
    /**
     * Set an end handler. Once the stream has ended, and there is no more data
     * to be read, the handler will be called.
     * @param {Handler} handler the handler to call
     */
    endHandler: function(handler) {
      jObj.endHandler(handler);
      return jsObj;
    },
    /**
     * Set an exception handler.
     */
    exceptionHandler: function(handler) {
      jObj.exceptionHandler(handler);
      return jsObj;
    }
  }

  jsObj.dataHandler      = ReadStream.dataHandler;
  jsObj.pause            = ReadStream.pause;
  jsObj.resume           = ReadStream.resume;
  jsObj.endHandler       = ReadStream.endHandler;
  jsObj.exceptionHandler = ReadStream.exceptionHandler;
}


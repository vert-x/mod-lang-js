writeStream = function(jsObj, jObj) {
  /**
   * This provides methods to write to a data stream. It's used by things
   * like AsyncFile and HttpClientRequest and is not meant to be used
   * directly.
   * @mixin
   */
  WriteStream = {
    /**
     * Write some data to the stream. The data is put on an internal write
     * queue, and the write actually happens asynchronously. To avoid running
     * out of memory by putting too much on the write queue, check the 
     * {@link#writeQueueFull} method before writing. This is done automatically
     * if using a {@link Pump}.
     * @param {Buffer} data the data to write
     */
    write: function(data) {
      jObj.write(data);
      return jsObj;
    },
    /**
     * Set the maximum size of the write queue to <code>maxSize</code>. You
     * will still be able to write to the stream even if there is more than
     * <code>maxSize</code> bytes in the write queue. This is used as an
     * indicator by classes such as <code>Pump</code> to provide flow control.
     * @param {number} size the size of the write queue
     */
    writeQueueMaxSize: function(size) {
      jObj.setWriteQueueMaxSize(size);
      return jsObj;
    },
    /**
     * This will return <code>true</code> if there are more bytes in the write
     * queue than the value set using <code>writeQueueMaxSize</code>
     */
    writeQueueFull: function() {
      return jObj.writeQueueFull();
    },
    /**
     * Set a drain handler on the stream. If the write queue is full, then the
     * handler will be called when the write queue has been reduced to maxSize/2.
     * See {@linkcode module:vertx/pump~Pump} for an example of this being used.
     * @param {Handler} handler the handler to call when the stream has been drained
     */
    drainHandler: function(handler) {
      jObj.drainHandler(handler);
      return jsObj;
    },
    /**
     * Set an exception handler on the stream
     * @param {Handler} handler the handler to call when an exception occurs
     */
    exceptionHandler: function(handler) {
      jObj.exceptionHandler(handler);
      return jsObj;
    }
  }

  jsObj.write             = WriteStream.write;
  jsObj.writeQueueMaxSize = WriteStream.writeQueueMaxSize;
  jsObj.writeQueueFull    = WriteStream.writeQueueFull;
  jsObj.drainHandler      = WriteStream.drainHandler;
  jsObj.exceptionHandler  = WriteStream.exceptionHandler;
}

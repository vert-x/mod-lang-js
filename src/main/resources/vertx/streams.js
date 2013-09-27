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
 * @module vertx/streams
 */

/**
 * Provides methods for querying and draining data streams.
 * This is used internally and exposed through the WriteStream
 * and other mixins and is not typically used directly.
 * @param {org.vertx.java.core.streams.WriteStream} delegate The Java delegate
 * @class
 */
DrainHandler = function(delegate) {
  /**
   * Set the maximum size of the write queue to <code>maxSize</code>. You
   * will still be able to write to the stream even if there is more than
   * <code>maxSize</code> bytes in the write queue. This is used as an
   * indicator by classes such as <code>Pump</code> to provide flow control.
   * @param {number} size the size of the write queue
   */
  this.writeQueueMaxSize = function(size) {
    delegate.setWriteQueueMaxSize(size);
    return this;
  }
  /**
   * This will return <code>true</code> if there are more bytes in the write
   * queue than the value set using <code>writeQueueMaxSize</code>
   */
  this.writeQueueFull = function() {
    return delegate.writeQueueFull();
  }
  /**
   * Set a drain handler on the stream. If the write queue is full, then the
   * handler will be called when the write queue has been reduced to maxSize/2.
   * See {@linkcode module:vertx/pump~Pump} for an example of this being used.
   * @param {Handler} handler the handler to call when the stream has been drained
   */
  this.drainHandler = function(handler) {
    delegate.drainHandler(handler);
    return this;
  }
  /**
   * Set an exception handler on the stream
   * @param {Handler} handler the handler to call when an exception occurs
   */
  this.exceptionHandler = function(handler) {
    delegate.exceptionHandler(handler);
    return this;
  }
}

/**
 * Provides methods to write to a data stream. It's used by things
 * like AsyncFile and HttpClientRequest and is not meant to be used
 * directly.
 * {@link module:vertx/streams~DrainHandler}
 *
 * @external org.vertx.java.core.streams.WriteStream
 * @param {org.vertx.java.core.streams.WriteStream} delegate The Java delegate
 * @mixes DrainHandler
 * @class
 */
WriteStream = function(delegate) {
  /**
   * Write some data to the stream. The data is put on an internal write
   * queue, and the write actually happens asynchronously. To avoid running
   * out of memory by putting too much on the write queue, check the 
   * {@link#writeQueueFull} method before writing. This is done automatically
   * if using a {@link Pump}.
   * @param {Buffer} data the data to write
   */
  this.write = function(data) {
    delegate.write(data);
    return this;
  }

  DrainHandler.call(this, delegate);

  /**
   * @private
   */
  this._delegate = function() { return delegate; }
}

/**
 * This provides methods to read from a data stream. It's used by things
 * like AsyncFile and HttpServerResponse and is not meant to be used
 * directly.
 * @external org.vertx.java.core.streams.ReadStream
 * @param {org.vertx.java.core.streams.ReadStream} delegate The Java delegate
 * @mixin
 */
ReadStream = function(delegate) {
  /**
   * Set a data handler. As data is read, the handler will be called with 
   * a Buffer containing the data read.
   * @param {BodyHandler} handler the handler to call
   */
  this.dataHandler = function(handler) {
    delegate.dataHandler(handler);
    return this;
  }
  /**
   * Pause the <code>ReadStream</code>. While the stream is paused, no data
   * will be sent to the data Handler
   */
  this.pause = function() {
    delegate.pause();
    return this;
  }
  /**
   * Resume reading. If the <code>ReadStream</code> has been paused, reading
   * will recommence on it.
   */
  this.resume = function() {
    delegate.resume();
    return this;
  }
  /**
   * Set an end handler. Once the stream has ended, and there is no more data
   * to be read, the handler will be called.
   * @param {Handler} handler the handler to call
   */
  this.endHandler = function(handler) {
    delegate.endHandler(handler);
    return this;
  }
  /**
   * Set an exception handler.
   * @param {Handler} handler the handler to call
   */
  this.exceptionHandler = function(handler) {
    delegate.exceptionHandler(handler);
    return this;
  }

  /**
   * @private
   */
  this._delegate = function() { return delegate; }
}

module.exports.ReadStream   = ReadStream;
module.exports.WriteStream  = WriteStream;
module.exports.DrainHandler = DrainHandler;


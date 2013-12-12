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
 * The {@linkcode module:vertx/buffer~Buffer} interface delegates most
 * function calls to the Java class provided by Vert.x
 *
 * @see https://github.com/eclipse/vert.x/blob/master/vertx-core/src/main/java/org/vertx/java/core/buffer/Buffer.java
 * @external org.vertx.java.core.buffer.Buffer
 */

/**
 * Most data in vert.x is shuffled around using buffers.
 *
 * A Buffer represents a sequence of zero or more bytes that can be written to
 * or read from, and which expands automatically as necessary to accomodate any
 * bytes written to it. You can perhaps think of a buffer as smart byte array.
 *
 * The methods documented for the Java Buffer objects
 * are applicable to Javascript Buffer instances as well. 
 *
 * @see https://github.com/eclipse/vert.x/blob/master/vertx-core/src/main/java/org/vertx/java/core/buffer/Buffer.java
 *
 * @example
 * var Buffer = require('vertx/buffer');
 * var buff   = new Buffer('Hello!');
 *
 * @example <caption>Creating Buffers</caption>
 * var Buffer = require('vertx/buffer');
 *
 * // Create a buffer from a string with UTF-8 encoding (the default)
 * var buff = new Buffer('Now is the winter of our discontent made glorioius summer');
 *
 * // Create a buffer from a string and specify an encoding
 * buff = new Buffer('Too hot, too hot!', 'UTF-16');
 *
 * // etc etc
 * // TODO: Finish these examples
 *
 * @constructor
 *
 * @constructor
 * @alias module:vertx/buffer
 * @param {string|number|undefined} [obj] The paramater from which the buffer will be created. If a string is given it
 *                                        create a new Buffer which contains the string. If a number is given it will
 *                                        create a new Buffer which has the given initial size. if no parameter is defined
 *                                        a new empty Buffer will be created.
 */
var Buffer = function(obj) {
  var __jbuf;
  if (typeof obj ==='undefined') {
    __jbuf = new org.vertx.java.core.buffer.Buffer();
  } else if (typeof obj === 'string') {
    __jbuf = new org.vertx.java.core.buffer.Buffer(obj);
  } else if (typeof obj === 'number') {
    __jbuf = new org.vertx.java.core.buffer.Buffer(obj);
  } else {
    __jbuf = obj;
  }

  /**
   * Get and unsigned 8 bit integer from the buffer.
   *
   * @param {number} pos the position
   * @returns {number}
   */
  this.getByte = function(pos) {
    return __jbuf.getByte(pos);
  };

  /**
   * Get and signed 32 bit integer from the buffer.
   *
   * @param {number} pos the position
   * @returns {number}
   */
  this.getInt = function(pos) {
    return __jbuf.getInt(pos);
  };

  /**
   * Get and signed 64 bit double from the buffer.
   *
   * @param {number} pos the position
   * @returns {number}
   */
  this.getDouble = function(pos) {
    return __jbuf.getDouble(pos);
  };

  /**
   * Get and signed 32 bit float from the buffer.
   *
   * @param {number} pos the position
   * @returns {number}
   */
  this.getFloat = function(pos) {
    return __jbuf.getFloat(pos);
  };

  /**
   * Get and signed 16 bit short from the buffer.
   *
   * @param {number} pos the position
   * @returns {number}
   */
  this.getShort = function(pos) {
    return __jbuf.getShort(pos);
  };

  /**
   * Get and {Buffer) for the given range from the buffer.
   *
   * @param {number} start of the range
   * @param {number} end of the range
   * @returns {Buffer}
   */
  this.getBuffer = function(start, end) {
    return new Buffer(__jbuf.getBuffer(start, end));
  };

  /**
   * Get and {string) for the given range from the buffer.
   *
   * @param {number} start of the range
   * @param {number} end of the range
   * @returns {string}
   */
  this.getString = function(start, end, enc) {
    if (typeof enc === 'undefined') {
      return __jbuf.getString(start, end);
    } else {
      return __jbuf.getString(start, end, enc);
    }
  };

  /**
   * Append to the buffer.
   *
   * @param {Buffer} buf a buffer
   * @returns {Buffer} this
   */
  this.appendBuffer = function(buf) {
    __jbuf.appendBuffer(buf._to_java_buffer());
    return this;
  };

  /**
   * Append to the buffer.
   *
   * @param {number} b a valid signed 8 bit integer
   * @returns {Buffer} this
   */
  this.appendByte = function(b) {
    __jbuf.appendByte(b);
    return this;
  };

  /**
   * Append to the buffer.
   *
   * @param {number} i a valid signed 32 bit integer
   * @returns {Buffer} this
   */
  this.appendInt = function(i) {
    __jbuf.appendInt(i);
    return this;
  };

  /**
   * Append to the buffer.
   *
   * @param {number} s a valid signed 16 bit short
   * @returns {Buffer} this
   */
  this.appendShort = function(s) {
    __jbuf.appendShort(s);
    return this;
  };

  /**
   * Append to the buffer.
   *
   * @param {number} f a valid signed 32 bit integer
   * @returns {Buffer} this
   */
  this.appendFloat = function(f) {
    __jbuf.appendFloat(f);
    return this;
  };

  /**
   * Append to the buffer.
   *
   * @param {number} d a valid signed 64 bit double
   * @returns {Buffer} this
   */
  this.appendDouble = function(d) {
    __jbuf.appendDouble(d);
    return this;
  };

  /**
   * Append to the buffer.
   *
   * @param {string} str the string
   * @param {string} enc the encoding to use or {undefined} if the default should be used.
   * @returns {Buffer} this
   */
  this.appendString = function(str, enc) {
    if (typeof enc === 'undefined') {
      __jbuf.appendString(str);

    } else {
      __jbuf.appendString(str, enc);
    }
    return this;
  };

  /**
   * Set on the buffer.
   *
   * @param {number} pos the position on which to set b
   * @param {number} b a valid signed 8 bit integer
   * @returns {Buffer} this
   */
  this.setByte = function(pos, b) {
    __jbuf.setByte(pos, b);
    return this;
  };

  /**
   * Set on the buffer.
   *
   * @param {number} pos the position on which to set i
   * @param {number} i a valid signed 32 bit integer
   * @returns {Buffer} this
   */
  this.setInt = function(pos, i) {
    __jbuf.setInt(pos, i);
    return this;
  };

  /**
   * Set on the buffer.
   *
   * @param {number} pos the position on which to set d
   * @param {number} d a valid signed 64 bit double
   * @returns {Buffer} this
   */
  this.setDouble = function(pos, d) {
    __jbuf.setDouble(pos, d);
    return this;
  };

  /**
   * Set on the buffer.
   *
   * @param {number} pos the position on which to set f
   * @param {number} f a valid signed 32 bit integer
   * @returns {Buffer} this
   */
  this.setFloat = function(pos, f) {
    __jbuf.setFloat(pos, f);
    return this;
  };

  /**
   * Set on the buffer.
   *
   * @param {number} pos the position on which to set s
   * @param {number} s a valid signed 16 bit short
   * @returns {Buffer} this
   */
  this.setShort = function(pos, s) {
    __jbuf.setShort(pos, s);
    return this;
  };

  /**
   * Set on the buffer.
   *
   * @param {number} pos the position on which to set s
   * @param {Buffer} b a buffer
   * @returns {Buffer} this
   */
  this.setBuffer = function(pos, b) {
    __jbuf.setBuffer(pos, b._to_java_buffer());
    return this;
  };

  /**
   * Set on the buffer.
   *
   * @param {number} pos the position on which to set str
   * @param {string} str the string
   * @param {string} enc the encoding to use or {undefined} if the default should be used.
   * @returns {Buffer} this
   */
  this.setString = function(pos, str, enc) {
    if (typeof enc === 'undefined') {
      __jbuf.setString(pos, str);
    } else {
      __jbuf.setString(pos, str, enc);
    }
    return this;
  };

  this.length = function() {
    return __jbuf.length();
  };

  /**
   * Create a copy of this buffer and it'S content.
   *
   * @returns {Buffer}
   */
  this.copy = function() {
    return new Buffer(__jbuf.copy());
  };

  this.equals = function(o) {
    if (o instanceof Buffer) {
      return __jbuf.equals(o._to_java_buffer());
    }
    return false;
  };

  this.toString = function(enc) {
    if (typeof enc === 'undefined')  {
      return __jbuf.toString();
    } else {
      return __jbuf.toString(enc);
    }
  };

  /**
   * @private
   */
  this._to_java_buffer = function() {
    return __jbuf;
  };
};


/**
 * See the Java documentation for information on the public API.
 *
 * @see https://github.com/vert-x/vert.x/blob/master/vertx-core/src/main/java/org/vertx/java/core/buffer/Buffer.java
 * @module vertx/buffer
 */
module.exports = Buffer;

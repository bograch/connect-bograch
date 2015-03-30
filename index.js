'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports = function (connect, bograch) {
  if (!connect) {
    throw new Error('connect was not passed to BograchStore wrapper');
  }
  if (!bograch) {
    throw new Error('bograch was not passed to BograchStore wrapper');
  }

  /**
   * Connect's Store.
   */
  var Store = connect.Store || connect.session.Store;

  /**
   * Initialize BograchStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  function BograchStore(options) {
    options = options || {};
    Store.call(this, options);

    this.client = new EventEmitter();
    var self = this;

    if (!options.transporterName) {
      throw new Error('transporterName was not passed in');
    }

    this._ttl = options.ttl || 60 * 60 * 24 * 7 * 2; // the default is 2 weeks in seconds
    this._touchAfter = options.touchAfter || 0;

    var client = bograch.client(options.transporterName, {
      name: 'session'
    }, function () {
      self.client.emit('connect');
    });

    client.register(['get', 'set', 'destroy']);

    this._client = client.methods;
  }

  /**
   * Inherit from `Store`.
   */
  util.inherits(BograchStore, Store);

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} callback
   * @api public
   */
  BograchStore.prototype.get = function (sid, cb) {
    this._client.get(sid, cb);
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} callback
   * @api public
   */
  BograchStore.prototype.set = function (sid, session, cb) {
    // removing the lastModified prop from the session object before update
    if (this._touchAfter > 0 && session && session.lastModified) {
      delete session.lastModified;
    }

    this._client.set(sid, session, {
      touchAfter: this._touchAfter,
      ttl: this._ttl
    }, cb);
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Function} callback
   * @api public
   */
  BograchStore.prototype.destroy = function (sid, cb) {
    this._client.destroy(sid, cb);
  };

  return BograchStore;
};
'use strict';

/**
 * module dependencies
 */

const iconv = require('iconv-lite');

/**
 * util
 */

const checkEncoding = enc => {
  // check iconv supported encoding
  if (enc && !iconv.encodingExists(enc)) {
    return new Error('encoding not supported by iconv-lite');
  }
};

/**
 * install the charset()
 */

module.exports = function install(superagent) {
  const Request = superagent.Request;

  /**
   * add `charset` to request
   *
   * @param {String} enc : the encoding
   */

  Request.prototype.charset = function(enc) {
    {
      let err;
      if ((err = checkEncoding(enc))) throw err;
    }

    // set the parser
    this._parser = function(res, cb) { // res not instanceof http.IncomingMessage
      const buffer = [];

      res.on('data', function(chunk) {
        buffer.push(chunk);
      });

      res.on('end', function() {
        let text, err;

        // detect if encoding if not specified
        if (!enc) {
          enc = (res.headers['content-type'].match(/charset=(.+)/) || []).pop();

          if (!enc) {
            enc = (buffer.toString().match(/<meta.+?charset=['"]?([^"']+)/) || []).pop();
          }

          // check
          if ((err = checkEncoding(enc))) return cb(err);

          if (!enc) {
            enc = 'utf-8';
          }
        }

        try {
          text = iconv.decode(Buffer.concat(buffer), enc);
        } catch (e) {
          err = e;
        } finally {
          res.text = text;
          cb(err);
        }
      });
    };

    return this;
  };

  return superagent;
};
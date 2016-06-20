'use strict';

const charset = require('../');
const should = require('should');

describe('Basic Test', function() {
  it('it works', function(done) {
    // install charset;
    const request = require('superagent');
    charset(request);

    request.get('http://www.sohu.com/')
      .charset('gbk')
      .end((err, res) => {
        res.text.should.match(/搜狐/);
        done(err);
      });
  });

  it('automatic detection', function(done) {
    // install charset;
    const request = require('superagent');
    charset(request);

    request.get('http://www.qq.com/')
      .charset() // automatic detection
      .end((err, res) => {
        res.text.should.match(/腾讯/);
        done(err);
      });
  });
});

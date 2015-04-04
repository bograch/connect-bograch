'use strict';

var expect = require('chai').expect;
var connectBograch = require('..');

describe('Package', function () {
  var connect = {
    Store: {}
  };
  var bograch = {};
  
  it('should throw error if no connect was passed', function () {
    expect(function () {
      connectBograch(null, bograch);
    }).to.throw(Error, 'connect was not passed to BograchStore wrapper');
  });
  
  it('should throw error if no bograch was passed', function () {
    expect(function () {
      connectBograch(connect, null);
    }).to.throw(Error, 'bograch was not passed to BograchStore wrapper');
  });
  
  describe('BograchStore', function () {
  });
});
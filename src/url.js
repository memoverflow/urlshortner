'use strict';

/**
 * 
 * @param {added days} days 
 */
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * URL entity class 
 * will serialized to DynamoDB
 * @class URL
 */
class URL {
  /**
   *
   * @param {hash code(partitionid)} hashid
   * @param {long url} l_url
   * @param {short url} s_url
   * @param {user token to generate hash code} token
   * @param {expire days} days
   */
  constructor(hashid, l_url, s_url, token, days) {
    const date = new Date();
    const exp = date.addDays(days);
    this.hashid = hashid;
    this.l_url = l_url;
    this.s_url = s_url;
    this.create_at = date.toUTCString();
    this.exp_at = exp.toUTCString();
    this.token = token;
  }
  getHashId() {
    return this.hashid;
  }
  getLongURL() {
    return this.l_url;
  }
  getShortURL() {
    return this.s_url;
  }
  getToken() {
    return this.token;
  }
  getCreateDate() {
    return this.create_at;
  }
  getExpireDate() {
    return this.exp_at;
  }
  setHashId(val) {
    this.hashid = val;
  }
  setLongURL(val) {
    this.l_url = val;
  }
  setToken(val) {
    this.token = val;
  }
  setCreateAt(val) {
    this.create_at = val;
  }
  setExpAt(val) {
    this.exp_at = val;
  }
}

module.exports = URL;

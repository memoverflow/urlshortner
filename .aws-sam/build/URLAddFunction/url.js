'use strict';

/**
 * Define the entity class of URL
 *
 * @param {*} hashid  hash code(partition id)
 * @param {*} l_url   long url
 * @param {*} s_url   short url
 * @param {*} create_at create date 
 * @param {*} exp_at  short url expire date
 */
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

class URL {
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
}










URL.prototype.getShortURL = (val) => {
  this.s_url = val;
}

URL.prototype.getExpireDate = (val) => {
  this.exp_at = val;
}



module.exports = URL;

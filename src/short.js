"use strict";

const crypto = require("crypto");

module.exports = {
  /**
   * generate a fix length hashid
   * @param {url string to short} longURL
   * @param {begin index} startIndex
   * @param {end index} endIndex
   */
  generateShortURL: (longURL, startIndex, endIndex) => {
    const hash = crypto
      .createHash("md5")
      .update(longURL)
      .digest("base64")
      .replace(/\//g, "")
      .replace(/\+/g, "");
    return hash.substring(startIndex, endIndex);
  },
};

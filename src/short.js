"use strict";

const crypto = require("crypto");

module.exports = {
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

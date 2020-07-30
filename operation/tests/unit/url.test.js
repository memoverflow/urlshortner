// Import app handler from lambda url.js
const URL = require("../../url");

// This includes all tests for url.js
describe("Test URL short", () => {

  // This test invokes generateShortURL() and compare the result
  test('Initial a URL class', () => {
    
    const u = {
      hashid: "ERddsfF",
      l_url:
        "https://github.com/awsdocs/aws-lambda-developer-guide/tree/master/sample-apps/nodejs-apig",
      s_url: "https://api.sname.be/ERddsfF",
      create_at: "Wed, 29 Jul 2020 12:59:44 GMT",
      exp_at: "Thu, 29 Jul 2021 12:59:44 GMT",
      token: "123123",
    };

    var url = new URL(u.hashid,u.l_url,u.s_url,u.token,365);
    expect(url.getHashId()).toEqual(u.hashid);
    expect(url.getLongURL()).toEqual(u.l_url);
    expect(url.getShortURL()).toEqual(u.s_url);
    expect(url.getToken()).toEqual(u.token);
    
    url.setCreateAt(u.create_at);
    url.setExpAt(u.exp_at);

    expect(url.getCreateDate()).toEqual(u.create_at);
    expect(url.getExpireDate()).toEqual(u.exp_at);
  });
    
});

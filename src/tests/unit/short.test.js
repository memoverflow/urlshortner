// Import app handler from lambda short.js
const short = require("../../short");

// This includes all tests for short.js
describe("Test URL short", () => {

  // This test invokes generateShortURL() and compare the result
  test('Short a long URL', () => {
    
    const url = "https://github.com/awsdocs/aws-lambda-developer-guide/tree/master/sample-apps/nodejs-apig"
    
    const result = short.generateShortURL(url,0,7);

    const expectCode = "YcktZQ0";
    
    expect(result).toEqual(expectCode); 
  });
    
});

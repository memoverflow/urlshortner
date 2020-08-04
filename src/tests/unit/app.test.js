// Import app handler from lambda app.js
const app = require("../../app");

// This includes all tests for app.js
describe("Test app handler", () => {
  //test('should 1', () => {});
  // This test invokes app.handler() and compare the result
  test('Short a long URL', async() => {
      
    // Mock the event json
    const event = {
      path: "/url",
      httpMethod: "POST",
      body: '{"url":"https://github.com/awsdocs/aws-lambda-developer-guide/tree/master/sample-apps/nodejs-apig",    "token":"2sdfdsf312312"}',
    };

    // Excute the handler and got a promise result
    let resp = await app.handler(event);

    // Declare a expect result
    const expectResult = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, DELETE, PUT",
      },
      body:
        '{"hashid":"aDoneEI","l_url":"https://github.com/awsdocs/aws-lambda-developer-guide/tree/master/sample-apps/nodejs-apig","s_url":"https://api.sname.be/aDoneEI","create_at":"Thu, 30 Jul 2020 06:33:17 GMT","exp_at":"Fri, 30 Jul 2021 06:33:17 GMT","token":"2sdfdsf312312"}',
    };

    // Compare the result
    expect(resp.statusCode).toEqual(expectResult.statusCode);

    expect(resp.headers[0]).toEqual(expectResult.headers[0]);
    expect(resp.headers[1]).toEqual(expectResult.headers[1]);

    // Convert the event body to JSON object
    var entity = JSON.parse(resp.body);
    var expEntity = JSON.parse(expectResult.body);

    expect(entity.hashid).toEqual(expEntity.hashid);
    expect(entity.l_url).toEqual(expEntity.l_url);
    expect(entity.s_url).toEqual(expEntity.s_url);
    expect(entity.token).toEqual(expEntity.token);
      
  });


  // This test invokes app.handler() and compare the result
  test('Delete a long URL', async() => {
      
    // Mock the event json
    const event = {
      path: "/url/4H3BD2x",
      httpMethod: "DELETE",
    };

    // Excute the handler and got a promise result
    let resp = await app.handler(event);

    console.log(resp)

    // Declare a expect result
    const expectResult = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, DELETE, PUT",
      },
      body: '"DELETED"',
    };

    // Compare the result
    expect(resp.statusCode).toEqual(expectResult.statusCode);
    expect(resp.body).toEqual(expectResult.body);

    expect(resp.headers[0]).toEqual(expectResult.headers[0]);
    expect(resp.headers[1]).toEqual(expectResult.headers[1]);
  });
    
});

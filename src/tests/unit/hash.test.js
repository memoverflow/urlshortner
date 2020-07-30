// // Import hash handler from lambda hash.js
// const hash = require("../../hash");
// const app = require("../../app");

// // This includes all tests for hash.js
// describe("Test hash handler success", () => {
//   let hashid;

//   // Prepare mock data for hash handler
//   beforeAll(async() => {
//     const event = {
//       path: "/url",
//       httpMethod: "POST",
//       body:
//         '{"url":"https://github.com/awsdocs/aws-lambda-developer-guide/tree/master/sample-apps/nodejs-apig",    "token":"2sdfdsf312312"}',
//     };
//     const demoData = await app.handler(event);
//     hashid = JSON.parse(demoData.body).hashid;
//   });

//   // Clean up mocks 
//   afterAll(async() => { 
//     // Mock the event json
//     const event = {
//       path: "/url/"+hashid ,
//       httpMethod: "DELETE"
//     };
//     await app.handler(event);
//   }); 

//   // This test invokes hash.handler() and compare the result
//   test('Redirect URL', async() => {
//     // Mock the event json
//     const event = {
//       path: "/" + hashid,
//       httpMethod: "GET"
//     };

//     // Excute the handler and got a promise result
//     let resp = await hash.handler(event);

//     // Declare a expect result
//     const expectResult = {
//       statusCode: 301,
//       headers: {
//         Location: "https://github.com/awsdocs/aws-lambda-developer-guide/tree/master/sample-apps/nodejs-apig"
//       },
//       body: '""'
//     };

//     // Compare the result
//     expect(resp.statusCode).toEqual(expectResult.statusCode);

//     expect(resp.headers.Location).toEqual(expectResult.headers.Location);

//   });

//   // This test invokes hash.handler() and return a 400 status code
//   test('Redirect a invlid URL', async() => {
//     // Mock the event json
//     const event = {
//       path: "/12345678",
//       httpMethod: "GET"
//     };

//     // Excute the handler and got a promise result
//     let resp = await hash.handler(event);

//     console.log(resp);

//     //Declare a expect result
//     const expectResult = {
//       statusCode: 404,
//       body: "\"Please passa valid URL\"",
//     };

//     // Compare the result
//     expect(resp.statusCode).toEqual(expectResult.statusCode);

//     expect(resp.body).toEqual(expectResult.body);

//   });
// });

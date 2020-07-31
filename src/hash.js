"use strict";

const AWS = require("aws-sdk");
const TABLE_NAME = "urlTable";
const STATUSCODE = {
  SUCCESS: 200,
  INTERERROR: 500,
  ILLEGAL: 400,
  NOTFOUND: 404,
  REDIRECT: 301,
};

let dynamo = new AWS.DynamoDB.DocumentClient({
  region: "us-east-2",
});

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

exports.handler = async (event) => {
  if (event.path) {
    const hashid = event.path.replace(/\//g, "");
    return await getItem(hashid);
  } else {
    return sendResponse(STATUSCODE.ILLEGAL, "Bad request");
  }
};

/**
 * get a short url by hashid from DynamoDB and return a 301 redirect
 * @param {hashid which use to search a model from DynamoDB} hashid 
 */
async function getItem(hashid) {
  let asyncGetItem = new Promise((res, rej) => {
    const params = {
      Key: {
        hashid: hashid,
      },
      TableName: TABLE_NAME,
    };

    dynamo.get(params, function (err, data) {
      if (err) {
        rej(err);
      } else {
        res(data.Item);
      }
    });
  });

  const response = await asyncGetItem;

  if (response) {
    var currentDate = Date.now();
    var expDate = Date.parse(response.exp_at);

    if (currentDate < expDate) {
      return sendResponse(STATUSCODE.REDIRECT, "", {
        Location: response.l_url,
      });
    } else {
      return sendResponse(
        STATUSCODE.ILLEGAL,
        "the url has been expeired"
      );
    }
  } else return sendResponse(STATUSCODE.NOTFOUND, "Please passa valid URL");
}

/**
 * return a http response to client
 * @param {http status code} statusCode 
 * @param {return message} message 
 * @param {Location:301} headers 
 */
function sendResponse(statusCode, message, headers) {
  return {
    statusCode: statusCode,
    headers: headers,
    body: JSON.stringify(message),
  };
}

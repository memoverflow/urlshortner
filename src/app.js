"use strict";

const AWS = require("aws-sdk");
const short = require("./short");
const URL = require("./url");
const HASHLENGTH = 7;
const TINYDOMAIN = "https://api.sname.be/";
const DURATION = 365;
const TABLE_NAME = "urlTable";
const STATUSCODE = {
  SUCCESS: 200,
  INTERERROR: 500,
  ILLEGAL: 400,
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
  console.log(event)
  console.log("event")
  if (event.httpMethod) {
    switch (event.httpMethod) {
      case "POST":
        return await saveItem(event);
      case "DELETE":
        return await deleteItem(event);
      default:
        return sendResponse(
          STATUSCODE.SUCCESS,
          "can not find the event.httpMethod property"
        );
    }
  } else {
    return sendResponse(STATUSCODE.ILLEGAL, "wrong request body");
  }
};

async function saveItem(event) {
  if (event.body !== null && event.body !== undefined) {
    const item = JSON.parse(event.body);
    const l_url = item.url;
    const hashid = short.generateShortURL(item.url + item.token, 0, HASHLENGTH);
    const s_url = TINYDOMAIN + hashid;
    const url = new URL(hashid, l_url, s_url, item.token, DURATION);

    const params = {
      TableName: TABLE_NAME,
      Item: url,
    };

    let asyncPutItem = new Promise((res, rej) => {
      dynamo.put(params, function (err, data) {
        if (err) {
          console.log("Error", err);
          rej(err);
        } else {
          console.log("Success", data);
          res(1);
        }
      });
    });

    const resp = await asyncPutItem;
    if(resp == 1) return sendResponse(STATUSCODE.SUCCESS, url);
    else return sendResponse(STATUSCODE.ILLEGAL, "wrong request body");
  } else {
    return sendResponse(STATUSCODE.ILLEGAL, "Wrong request body");
  }
}

async function deleteItem(event) {
  const hashid = event.path.replace(/\/url\//g, "");
  let asyncDeleteItem = new Promise((res, rej) => {
    const params = {
      Key: {
        hashid: hashid,
      },
      TableName: TABLE_NAME,
    };
    dynamo.delete(params, function (err, data) {
      if (err) {
        console.log("Error", err);
        rej(-1);
      } else {
        console.log("Success", data);
        res(1);
      }
    });
  });

  const resp = await asyncDeleteItem;
  if (resp == 1) return sendResponse(STATUSCODE.SUCCESS, "DELETED");
  else return sendResponse(STATUSCODE.ILLEGAL, "Wrong request body");
}

function sendResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, DELETE, PUT",
    },
    body: JSON.stringify(message),
  };
}

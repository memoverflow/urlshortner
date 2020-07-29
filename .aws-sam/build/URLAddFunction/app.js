"use strict";

const db = require("./db");
const short = require("./short");
const URL = require("./url");
const HASHLENGTH = 7;
const TINYDOMAIN = "https://api.sname.be/";
const DURATION = 365;

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
exports.saveHandler = (event, context,callback) => {
  if(event.url&& event.token){
    saveItem(event, callback);
  }
  return sendResponse(400,"wrong request body",callback);
};

exports.getHandler = (event, context, callback) => {
  return {
    statusCode:200,
    body:"hello world"
  }
};

exports.deleteHandler = (event, context, callback) => {
  return {
    statusCode: 200,
    body: "hello world",
  };
};

function saveItem(event, callback) {
  const item = event;
  const l_url = item.url;
  const hashid = short.generateShortURL(event.url+event.token,0,HASHLENGTH);
  const s_url = TINYDOMAIN+hashid;
  const url = new URL(hashid,l_url,s_url,DURATION);

  db.saveItem(url,db.Tables.URLTABLE.toString()).then(
    (response) => {   
      console.log(response);
      sendResponse(200, url, callback);
    },
    (reject) => {
      sendResponse(400, reject, callback);
    }
  );
}

// function getItem(event, callback) {
//   const itemId = event.pathParameters.productId;

//   db.getItem(itemId).then(
//     (response) => {
//       console.log(response);
//       if (response) sendResponse(200, response, callback);
//       else sendResponse(404, "Please passa valid hashid", callback);
//     },
//     (reject) => {
//       sendResponse(400, reject, callback);
//     }
//   );
// }

function sendResponse(statusCode, message, callback) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
  callback(null, response);
}

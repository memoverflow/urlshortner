"use strict";

const db = require("./db");
const short = require("./short");
const URL = require("./url").default;
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
exports.operationHandler = (event, context,callback) => {
  if (event.httpMethod && event.body) {
    switch(event.httpMethod) {
      case "POST":
        saveItem(event.body, callback);
        break;
      default:
        sendResponse(400,"can not find the event.httpMethod property",callback);
    }
  }
  return sendResponse(400,"wrong request body",callback);
};

exports.hashHandler = (event, context, callback) => {
  if(event.path){
    const path = event.path.replace(/\//g,'');
    getItem(path,callback);
  }
};

function saveItem(body, callback) {
  if (body.url && body.token)
  {
    const item = body;
    const l_url = item.url;
    const hashid = short.generateShortURL(item.url + item.token, 0, HASHLENGTH);
    const s_url = TINYDOMAIN+hashid;
    const url = new URL(hashid,l_url,s_url,item.token,DURATION);

    db.saveItem(url,db.Tables.URLTABLE.description).then(
      (response) => {   
        console.log(response);
        sendResponse(200, url, callback);
      },
      (reject) => {
        sendResponse(400, reject, callback);
      }
    );
  }else{
    sendResponse(400, "wrong request body", callback);
  }
}

function getItem(itemId, callback) {
  db.getItem(itemId, db.Tables.URLTABLE.description).then(
    (response) => {
      console.log(response);
      if (response) {
        return {
          statusCode: 301,
          headers: {
            Location: response.l_url,
          },
        };
      } else sendResponse(404, "Please passa valid hashid", callback);
    },
    (reject) => {
      sendResponse(400, reject, callback);
    }
  );
}

function sendResponse(statusCode, message, callback) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
  callback(null, response);
}

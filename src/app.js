"use strict";

const AWS = require("aws-sdk");
const short = require("./short");
// URL entity
const URL = require("./url");
// Hashid length, will return to user
const HASHLENGTH = 7;
// Default domain. Now I use api.sname.be, but should be sname.be
const TINYDOMAIN = "https://api.sname.be/";
// short url expire date (days)
const DURATION = 365;
// dynamoDB name
const TABLE_NAME = "urlTable";
const EXCEPTIONMESSAGE = "Bad request";
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
  if (event.httpMethod) {
    switch (event.httpMethod) {
      case "POST":
        if (event.body !== null && event.body !== undefined) {
          const item = JSON.parse(event.body);
          return await saveItem(item, 0);
        }
      case "DELETE":
        return await deleteItem(event);
      default:
        return sendResponse(STATUSCODE.ILLEGAL, "Bad request");
    }
  } else {
    return sendResponse(STATUSCODE.ILLEGAL, EXCEPTIONMESSAGE);
  }
};

/**
 * save url data to dynamoDB
 * @param {event from API Gateway} event
 */
async function saveItem(item, times) {
  const l_url = item.url;
  if (!validateUrl(l_url))
    return sendResponse(STATUSCODE.ILLEGAL, "invalid url");
  const hashid = short.generateShortURL(encodeURI(item.url) + item.token, 0, HASHLENGTH);
  const s_url = TINYDOMAIN + hashid;
  const url = new URL(hashid, l_url, s_url, item.token, DURATION);

  const params = {
    TableName: TABLE_NAME,
    Item: url,
    ConditionExpression: "attribute_not_exists(hashid)",
  };
  try {
    let asyncPutItem = new Promise((res, rej) => {
      dynamo.put(params, function (err, data) {
        if (err) {
          console.log("Error", err);
          rej(err);
        } else {
          console.log("Success", data);
          res(data);
        }
      });
    });

    await asyncPutItem;
    return sendResponse(STATUSCODE.SUCCESS, url);
  } catch (e) {
    if (times < 3) {
      item.token = randomRange(8, 8);
      times++;
      return await saveItem(item, times);
    }
    return sendResponse(STATUSCODE.ILLEGAL, EXCEPTIONMESSAGE);
  }
}

/**
 * delete url data to dynamoDB
 * @param {event from API Gateway} event
 */
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
  else return sendResponse(STATUSCODE.ILLEGAL, EXCEPTIONMESSAGE);
}

/**
 * return a http response to client
 * @param {http status code} statusCode
 * @param {return message} message
 * @param {cors header} headers
 */
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

/**
 * valid aa URL
 * @param {URL} value
 */
function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}

/**
 * Random a string token
 * @param {Min length} min
 * @param {Max length} max
 */
function randomRange(min, max) {
  var returnStr = "",
    range = max ? Math.round(Math.random() * (max - min)) + min : min,
    arr = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
  for (var i = 0; i < range; i++) {
    var index = Math.round(Math.random() * (arr.length - 1));
    returnStr += arr[index];
  }
  return returnStr;
}

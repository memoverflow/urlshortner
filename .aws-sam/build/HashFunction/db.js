"use strict";

const AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient({
  region: "us-east-2",
});

const TABLE_NAME = "urlTable";

const Tables = Object.freeze({
  URLTABLE: Symbol("urlTable"),
  USERTABLE: Symbol("userTable")
});

module.exports.Tables = Tables;

module.exports.initializateDynamoClient = (newDynamo) => {
  dynamo = newDynamo;
};

module.exports.saveItem = (item,table) => {
  const params = {  
    TableName: table,
    Item: item,
  };

  return dynamo
    .put(params)
    .promise()
    .then(
      (result) => {
        return item;
      },
      (error) => {
        return error;
      }
    );
};

module.exports.getItem = (itemId,table) => {
  const params = {
    Key: {
      hashid: itemId,
    },
    TableName: table,
  };

  return dynamo
    .get(params)
    .promise()
    .then(
      (result) => {
        return result.Item;
      },
      (error) => {
        return error;
      }
    );
};

module.exports.deleteItem = (itemId) => {
  const params = {
    Key: {
      hashid: itemId,
    },
    TableName: TABLE_NAME,
  };

  return dynamo.delete(params).promise();
};

module.exports.updateItem = (itemId, item) => {
  let vbl = "x";
  let adder = "y";
  let updateexp = "set ";
  let itemKeys = Object.keys(item);
  let expattvalues = {};

  for (let i = 0; i < itemKeys.length; i++) {
    vbl = vbl + adder;

    if (itemKeys.length - 1 == i) updateexp += itemKeys[i] + " = :" + vbl;
    else updateexp += itemKeys[i] + " = :" + vbl + ", ";

    expattvalues[":" + vbl] = item[itemKeys[i]];
  }

  console.log("update expression and expressionAttributeValues");
  console.log(updateexp, expattvalues);

  const params = {
    TableName: TABLE_NAME,
    Key: {
      productId: itemId,
    },
    ConditionExpression: "attribute_exists(hashid)",
    UpdateExpression: updateexp,
    ExpressionAttributeValues: expattvalues,
    ReturnValues: "ALL_NEW",
  };

  return dynamo
    .update(params)
    .promise()
    .then(
      (response) => {
        return response.Attributes;
      },
      (error) => {
        return error;
      }
    );
};

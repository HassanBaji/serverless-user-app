import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddb = new DynamoDBClient({
  region: "us-east-1",
});

export const ddbClient = DynamoDBDocumentClient.from(ddb);

import { middyfy } from "@lib/middleware";
import AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider();
export default middyfy(async (event) => {
  const { email, password } = event.body;

  const params = {
    UserPoolId: process.env.USER_POOL_ID!,
    Username: email,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    MessageAction: "SUPPRESS",
  };

  const response = await cognito.adminCreateUser(params).promise();
  if (response.User) {
    const paramsForSetPass = {
      Password: password,
      UserPoolId: process.env.USER_POOL_ID!,
      Username: email,
      Permanent: true,
    };
    await cognito.adminSetUserPassword(paramsForSetPass).promise();
  }
  return {
    statusCode: 200,
    body: JSON.stringify("user succefully created"),
  };
});

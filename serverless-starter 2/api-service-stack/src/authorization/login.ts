import { middyfy } from "@lib/middleware";
import AWS from "aws-sdk";
const cognito = new AWS.CognitoIdentityServiceProvider();

export default middyfy(async (event) => {
  const { email, password } = event.body;

  const params = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    UserPoolId: process.env.USER_POOL_ID!,
    ClientId: process.env.USER_POOL_CLIENT_ID!,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  const response = await cognito.adminInitiateAuth(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(response.AuthenticationResult?.IdToken),
  };
});

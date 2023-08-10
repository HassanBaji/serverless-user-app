import { middyfy } from "api-service-stack/src/libs/middleware";

export default middyfy(async (event) => {
  console.log({ event });
  return {
    statusCode: 201,
    body: null,
  };
});

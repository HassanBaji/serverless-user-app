import { middyfy } from "@lib/middleware";
import { GetUsers } from "./useCase";

const getUsers = new GetUsers();
export default middyfy(async (event) => {
  console.log({ event });
  try {
    const myUsers = await getUsers.getUsers();
    if (myUsers) {
      return {
        statusCode: 201,
        body: JSON.stringify(myUsers),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: {
            title: "Error",
            message: "something went wrong",
          },
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          title: "Error",
          message: error.message,
        },
      }),
    };
  }
});

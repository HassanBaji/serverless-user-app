import { middyfy } from "@lib/middleware";
import { GetUsersById } from "./useCase";

const getUsers = new GetUsersById();
export default middyfy(async (event) => {
  try {
    const { email } = event.body;
    const myUsers = await getUsers.getUsersById(email);
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

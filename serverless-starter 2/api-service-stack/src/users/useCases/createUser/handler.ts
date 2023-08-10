import { middyfy } from "@lib/middleware";
import { CreateUser } from "./useCase";

const createUser = new CreateUser();

export default middyfy(async (event) => {
  try {
    const { name, email, phoneNumber } = event.body;

    if (!name || name.length === 0) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: {
            title: "ValidationError",
            message: "Name is required",
          },
        }),
      };
    }
    if (!email || email.length === 0) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: {
            title: "ValidationError",
            message: "email is required",
          },
        }),
      };
    }
    if (!phoneNumber || phoneNumber.length === 0) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: {
            title: "ValidationError",
            message: "phonenumber is required",
          },
        }),
      };
    }

    const newUser = await createUser.createUser(name, email, phoneNumber);

    return {
      statusCode: 201,
      body: JSON.stringify(newUser),
    };
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

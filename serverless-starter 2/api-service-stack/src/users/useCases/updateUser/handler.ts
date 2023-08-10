import { middyfy } from "@lib/middleware";
import { UpdateUser } from "./useCase";

const updateUser = new UpdateUser();

export default middyfy(async (event) => {
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

  try {
    const updatedUser = await updateUser.updateUser(name, email, phoneNumber);

    if (!updatedUser) {
      throw new Error("something unexpected");
    }

    return {
      statusCode: 201,
      body: JSON.stringify(updatedUser),
    };
  } catch (error) {
    console.log({ error });
  }
});

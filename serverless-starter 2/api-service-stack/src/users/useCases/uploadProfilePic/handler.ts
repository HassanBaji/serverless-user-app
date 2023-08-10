import { middyfy } from "@lib/middleware";
import { UploadProfilePicUseCase } from "./useCase";
import files from "../../../../functions";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
const uploadProfilePicUseCase = new UploadProfilePicUseCase();

const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];

export default middyfy(async (event) => {
  try {
    console.log("I am in controller");
    const { image, email } = event.body;
    if (!image) {
      return {
        statusCode: 201,
        body: JSON.stringify("no data"),
      };
    }

    // if (!allowedMimes.includes(mime)) {
    //   return {
    //     statusCode: 201,
    //     body: JSON.stringify("mime not compatiple"),
    //   };
    // }

    const addPic = await uploadProfilePicUseCase.uploadProfilePic(image, email);
    if (addPic) {
      return {
        statusCode: 201,
        body: JSON.stringify(addPic),
      };
    } else {
      throw new Error("something is wrong");
    }
  } catch (error) {
    return {
      statusCode: 201,
      body: JSON.stringify(error),
    };
  }
});

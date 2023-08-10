import { UsersRepo } from "../../../../src/users/repos/UsersRepo";
import { UsersMapper } from "../../../../src/users/mappers/UsersMapper";
import { UsersClass } from "../../../../src/users/entities/UsersClass";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({ region: "us-east-1" });

export class UpdateUser {
  readonly userRepo: UsersRepo;
  readonly userMapper: UsersMapper;

  constructor() {
    this.userRepo = new UsersRepo();
    this.userMapper = new UsersMapper();
  }

  public updateUser = async (
    name: string,
    email: string,
    phoneNumber: string
  ) => {
    try {
      const myUser = new UsersClass(name, phoneNumber, email);
      const myUpdatedUser = await this.userRepo.updateUser(myUser);
      if (!myUpdatedUser) {
        throw new Error("something went wrong");
      }
      await sendToSNS(myUser);
      return myUpdatedUser;
    } catch (error) {
      throw new Error(error);
    }
  };
}

async function sendToSNS(userData: UsersClass) {
  try {
    const params = {
      TopicArn: process.env.TOPIC_ARN!,
      Message: JSON.stringify({
        name: userData.name,
        email: userData.email,
        method: "Create",
      }),
      MessageAttributes: {
        // MessageAttributeMap
        type: {
          // MessageAttributeValue
          DataType: "String", // required
          StringValue: "UPDATE",
        },
      },
    };

    console.log("Sending message to SNS topic...");
    const message = await sns.send(new PublishCommand(params));

    if (message) {
      console.log("Message published to SNS topic.");
      console.log({ message });
    } else {
      console.log("Failed to publish message to SNS topic.");
    }
  } catch (error) {
    console.log({ error });
  }
}

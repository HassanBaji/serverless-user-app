import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { UsersClass } from "../../../../src/users/entities/UsersClass";
import { UsersRepo } from "../../../../src/users/repos/UsersRepo";
const sns = new SNSClient({ region: "us-east-1" });

export class CreateUser {
  readonly userRepo: UsersRepo;

  constructor() {
    this.userRepo = new UsersRepo();
  }

  public createUser = async (
    name: string,
    email: string,
    phoneNumber: string
  ) => {
    try {
      const myUser = new UsersClass(name, phoneNumber, email);
      const userCreated = await this.userRepo.createUser(myUser);
      if (!userCreated) {
        throw new Error("something went wrong");
      }
      await sendToSNS(myUser);
      console.log("here");
      return userCreated;
    } catch (error) {
      console.log(error);
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
        // method: "Create",
      }),
      MessageAttributes: {
        // MessageAttributeMap
        type: {
          // MessageAttributeValue
          DataType: "String", // required
          StringValue: "CREATE",
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

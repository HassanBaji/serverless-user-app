import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbClient } from "../db/users";
import { UsersClass } from "../entities/UsersClass";
import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { UsersMapper, toDomainProps } from "../mappers/UsersMapper";

export class UsersRepo {
  readonly ddbClient: DynamoDBDocumentClient;
  readonly usersMapper: UsersMapper;

  constructor() {
    this.ddbClient = ddbClient;
    this.usersMapper = new UsersMapper();
  }

  public getUsers = async (): Promise<UsersClass[] | null> => {
    try {
      const command = new QueryCommand({
        TableName: process.env.TABLE_NAME!,
        KeyConditionExpression: "pk = :pkval",
        ExpressionAttributeValues: {
          ":pkval": { S: "user" },
        },
      });
      const response = await this.ddbClient.send(command);
      const users = response.Items?.map((user) => ({
        name: user.name.S,
        phoneNumber: user.phoneNumber.S,
        email: user.email.S,
      }));
      if (users) {
        const props: toDomainProps[] = users.map((user) => ({
          name: user.name ?? " ",
          phoneNumber: user.phoneNumber ?? "",
          email: user.email ?? "",
        }));
        const myUserToClass: UsersClass[] = [];
        props.forEach((prop) =>
          myUserToClass.push(this.usersMapper.toDomain(prop))
        );

        return myUserToClass;
      }
      return null;
    } catch (error) {
      throw new Error(error);
    }
  };

  public getUsersById = async (email: string): Promise<UsersClass[] | null> => {
    console.log;
    try {
      console.log("Im in repo");
      const command = new QueryCommand({
        TableName: process.env.TABLE_NAME!,
        KeyConditionExpression: "pk = :pkval and sk = :skval",
        ExpressionAttributeValues: {
          ":pkval": { S: "user" },
          ":skval": { S: `${email}` },
        },
      });
      console.log(command);
      const response = await this.ddbClient.send(command);
      console.log(response);
      if (!response) {
        console.log("fuck");
        throw new Error("response was not satisfied");
      }
      console.log(response);
      const users = response.Items?.map((user) => ({
        name: user.name.S,
        phoneNumber: user.phoneNumber.S,
        email: user.email.S,
      }));
      console.log(users);

      if (users) {
        const props: toDomainProps[] = users.map((user) => ({
          name: user.name ?? " ",
          phoneNumber: user.phoneNumber ?? "",
          email: user.email ?? "",
        }));
        console.log(props);
        const myUserToClass: UsersClass[] = [];
        props.forEach((prop) =>
          myUserToClass.push(this.usersMapper.toDomain(prop))
        );
        return myUserToClass;
      }
      return null;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  public createUser = async (user: UsersClass) => {
    const myUserToPersistent = this.usersMapper.toPersistent(user);
    console.log({ myUserToPersistent });
    const command = new PutCommand({
      TableName: process.env.TABLE_NAME!,
      Item: {
        pk: myUserToPersistent.pk,
        sk: myUserToPersistent.sk,
        name: myUserToPersistent.name,
        email: myUserToPersistent.email,
        phoneNumber: myUserToPersistent.phoneNumber,
      },
    });

    const response = await this.ddbClient.send(command);
    console.log({ response });
    console.log("here");
    return response;
  };

  public updateUser = async (user: UsersClass) => {
    try {
      const myUserToPersistent = this.usersMapper.toPersistent(user);

      const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME!,
        Key: {
          pk: myUserToPersistent.pk,
          sk: myUserToPersistent.sk,
        },
        UpdateExpression: "set #name = :name , phoneNumber = :phoneNumber",
        ExpressionAttributeNames: {
          "#name": "name",
        },

        ExpressionAttributeValues: {
          ":name": myUserToPersistent.name,
          ":phoneNumber": myUserToPersistent.phoneNumber,
        },
      });

      const response = await this.ddbClient.send(command);
      if (!response) {
        throw new Error("something went wrong");
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  };
}

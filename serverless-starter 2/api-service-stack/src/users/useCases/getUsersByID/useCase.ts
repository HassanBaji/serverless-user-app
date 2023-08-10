import { UsersRepo } from "../../repos/UsersRepo";
import { UsersMapper } from "../../../../src/users/mappers/UsersMapper";
import { UsersClass } from "../../../../src/users/entities/UsersClass";
import {
  GetObjectCommand,
  S3Client,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const client = new S3Client({ region: "us-east-1" });

export class GetUsersById {
  readonly usersRepo: UsersRepo;
  readonly usersMapper: UsersMapper;

  constructor() {
    (this.usersMapper = new UsersMapper()), (this.usersRepo = new UsersRepo());
  }

  public getUsersById = async (email: string) => {
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME!,
        Prefix: `${email}`,
      });
      let str: string | undefined;
      let s3ObjectUrl: string;
      const listResponse = await client.send(listCommand);
      const objects = listResponse.Contents;
      if (objects) {
        if (objects.length > 0) {
          const firstObjectKey = objects[0].Key;
          const getObjectCommand = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: firstObjectKey,
          });

          s3ObjectUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${firstObjectKey}`;
          const response = await client.send(getObjectCommand);
          str = await response.Body?.transformToString();
        }
      }
      const myUsers: UsersClass[] | null = await this.usersRepo.getUsersById(
        email
      );
      let myUsersToDto: { name: string; phoneNumber: string; email: string }[] =
        [];
      myUsers?.forEach((user) =>
        myUsersToDto.push(this.usersMapper.toDto(user, s3ObjectUrl))
      );
      if (myUsersToDto.length != 0) {
        return myUsersToDto;
      }

      return null;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };
}

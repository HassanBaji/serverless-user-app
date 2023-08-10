import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuid } from "uuid";
const client = new S3Client({ region: "us-east-1" });

export class UploadProfilePicUseCase {
  public uploadProfilePic = async (image: any, email: string) => {
    try {
      let imageData = image;
      if (image.substr(0, 7) === "base64,") {
        imageData = image.substr(7, image.length);
      }
      console.log(imageData);
      const buffer = Buffer.from(imageData, "base64");
      console.log("Buffer:", buffer);
      const fileInfo = await fileTypeFromBuffer(buffer);
      const detectedExt = fileInfo?.ext;
      const detectedMime = fileInfo?.mime;

      console.log({ detectedMime });

      const name = uuid();
      const key = `${email}/${name}.${detectedExt}`;

      console.log(`writing image to bucket called ${key}`);
      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: detectedMime,
      });
      console.log("I am in UseCase");

      const response = await client.send(command);
      console.log("I am in response");
      console.log({ response });
      // const url = `https://${process.env.imageUploadBucket}.s3-${process.env.region}.amazonaws.com/${key}`;
      return response;
    } catch (err) {
      console.log("I am in error");
      console.log(err);
      throw new Error(err);
    }
  };
}

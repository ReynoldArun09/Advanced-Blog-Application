import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../lib/s3-client";

export const putObject = async (file: any, fileName: any) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${fileName}`,
      Body: file,
      ContentType: "image/jpg,jpeg,png",
    };
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    if (data.$metadata.httpStatusCode !== 200) {
      return;
    }
    let url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    console.log(url);
    return { url, key: params.Key };
  } catch (error) {
    console.log(error);
  }
};

export const deleteObject = async (key: string) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    const data = await s3Client.send(command);
    if (data.$metadata.httpStatusCode !== 204) {
      return { status: 400, data };
    }
    return { status: 204 };
  } catch (error) {
    console.log(error);
  }
};

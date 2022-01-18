import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as uniqid from "uniqid";
import { loggerFactory } from "./logging";

/**
 * @todo validate url is data url
 */
export async function storeImage(imageDataUrl: string) {
  const logger = loggerFactory("storeImage");
  logger.debug("Storing image in S3");

  //  todo: see if we move this out so it gets cached by lambda
  const S3_REGION = process.env.S3_REGION;
  const S3_BUCKET = process.env.S3_BUCKET;
  const IMAGE_STORE_BASE_PATH = process.env.IMAGE_STORE_BASE_PATH;

  const s3client = new S3Client({ region: S3_REGION });

  const buffer = Buffer.from(
    imageDataUrl.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const contentType = imageDataUrl?.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];

  const ext = contentType.replace("image/", "");
  const key = `${uniqid()}.${ext}`;
  logger.debug(`Image key has been set to ${key}`);
  logger.debug("Image is being sent to S3");
  await s3client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const savedImageUrl = `${IMAGE_STORE_BASE_PATH}/${key}`;
  logger.debug(`Image stored as ${savedImageUrl}`);
  return savedImageUrl;
}

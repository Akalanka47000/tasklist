import { UploadedFile } from 'express-fileupload';
import { default as config } from '@/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  }
});

export const uploadFile = (file: UploadedFile) => {
  const key = `blott/${file.name}`;
  const command = new PutObjectCommand({
    Bucket: config.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.data,
    ContentType: file.mimetype
  });
  return client.send(command).then(() => {
    return encodeURI(`https://${config.AWS_S3_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${key}`);
  });
};

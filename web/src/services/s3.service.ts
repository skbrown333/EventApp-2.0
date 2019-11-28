import AWS, { S3 } from "aws-sdk";
import { AWS as AWS_CONSTANTS } from "../constants/constants";

export default class S3Service {
  readonly s3Instance;

  constructor() {
    AWS.config.update({
      region: "us-east-1",
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:9a6b4509-7fcf-4576-970a-ea1b0b121626"
      })
    });
    this.s3Instance = new AWS.S3();
  }

  uploadPhoto = (key, file, path, next) => {
    let params = {
      Bucket: `${AWS_CONSTANTS.bucket}/${path}`,
      Key: key,
      Body: file,
      ACL: "public-read",
      ContentType: file.type
    };

    this.s3Instance.putObject(params, next);
  };
}

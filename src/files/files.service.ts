import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { ObjectIdentifier } from 'aws-sdk/clients/s3';

@Injectable()
export class FilesService {
  private s3: S3;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    return this.s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: filename,
      })
      .promise();
  }

  async deletePublicFile(pathname: string) {
    return this.s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: pathname,
      })
      .promise();
  }

  async deletePublicFiles(files: ObjectIdentifier[]) {
    return this.s3
      .deleteObjects({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Delete: {
          Objects: files,
        },
      })
      .promise();
  }
}

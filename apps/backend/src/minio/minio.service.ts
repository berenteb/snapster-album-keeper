import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
import { Readable } from "stream";

import { Environment } from "../config/environment";

export interface MinioUploader {
  upload: (
    file: File | Buffer | Readable,
    objectName: string,
    size?: number,
    metadata?: Record<string, string>,
  ) => Promise<string>;
  delete: (objectName: string) => Promise<void>;
  getSignedUrl: (objectName: string, expiry: number) => Promise<string | null>;
  getSignedUploadUrl: (objectName: string, expiry: number) => Promise<string>;
  download: (objectName: string) => Promise<Buffer>;
  checkFileExists: (objectName: string) => Promise<boolean>;
}

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Minio.Client;
  private readonly defaultBucket: string;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<Environment["minio"]>("minio");

    if (!config) {
      throw new Error("Minio configuration not found");
    }

    this.minioClient = new Minio.Client({
      endPoint: config.endPoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
    });

    this.defaultBucket = config.defaultBucket;
  }

  async onModuleInit() {
    await this.createBucketIfNotExists(this.defaultBucket);
  }

  async createUploader(
    bucket: string = this.defaultBucket,
  ): Promise<MinioUploader> {
    await this.createBucketIfNotExists(bucket);
    return {
      upload: (file, objectName, size, metadata) =>
        this.upload(file, objectName, bucket, size, metadata),
      delete: (objectName) => this.delete(objectName, bucket),
      getSignedUrl: (objectName, expiry) =>
        this.getSignedUrl(objectName, expiry, bucket),
      getSignedUploadUrl: (objectName, expiry) =>
        this.getSignedUploadUrl(objectName, expiry, bucket),
      download: (objectName) => this.download(objectName, bucket),
      checkFileExists: (objectName) => this.checkFileExists(objectName, bucket),
    };
  }

  async getSignedUploadUrl(
    objectName: string,
    expiry: number = 60 * 60,
    bucket: string = this.defaultBucket,
  ): Promise<string> {
    try {
      return await this.minioClient.presignedPutObject(
        bucket,
        objectName,
        expiry,
      );
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw error;
    }
  }

  async upload(
    file: File | Buffer | Readable,
    objectName: string,
    bucket: string = this.defaultBucket,
    size?: number,
    metadata?: Record<string, string>,
  ): Promise<string> {
    try {
      let fileStream: Readable | null = null;

      if (Buffer.isBuffer(file)) {
        fileStream = Readable.from(file);
      } else if (file instanceof Readable) {
        fileStream = file;
      }

      if (!fileStream) {
        throw new Error("Invalid file type");
      }

      await this.minioClient.putObject(
        bucket,
        objectName,
        fileStream,
        size,
        metadata,
      );

      return objectName;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw error;
    }
  }

  async download(
    objectName: string,
    bucket: string = this.defaultBucket,
  ): Promise<Buffer> {
    try {
      const dataStream = await this.minioClient.getObject(bucket, objectName);
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        dataStream.on("data", (chunk) => chunks.push(chunk));
        dataStream.on("end", () => resolve(Buffer.concat(chunks)));
        dataStream.on("error", reject);
      });
    } catch (error) {
      this.logger.error(`Failed to download file: ${error.message}`);
      throw error;
    }
  }

  async delete(
    objectName: string,
    bucket: string = this.defaultBucket,
  ): Promise<void> {
    try {
      await this.minioClient.removeObject(bucket, objectName);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }

  async getSignedUrl(
    objectName: string,
    expiry: number = 60 * 60, // 1 hour in seconds
    bucket: string = this.defaultBucket,
  ): Promise<string | null> {
    try {
      if (!(await this.checkFileExists(objectName, bucket))) {
        this.logger.warn(`File '${objectName}' does not exist`);
        return null;
      }
      const url = await this.minioClient.presignedGetObject(
        bucket,
        objectName,
        expiry,
      );
      const parsedUrl = new URL(url);
      const publicUrl = this.configService.get("minio").publicUrl;

      if (publicUrl) {
        return `${publicUrl}${parsedUrl.pathname}${parsedUrl.search}`;
      }

      return parsedUrl.toString();
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw error;
    }
  }

  private async checkFileExists(
    objectName: string,
    bucket: string = this.defaultBucket,
  ): Promise<boolean> {
    try {
      await this.minioClient.statObject(bucket, objectName);
      return true;
    } catch {
      return false;
    }
  }

  private async createBucketIfNotExists(bucket: string) {
    try {
      const bucketExists = await this.minioClient.bucketExists(bucket);

      if (bucketExists) {
        this.logger.log(`Bucket '${bucket}' already exists`);
      } else {
        this.logger.log(`Bucket '${bucket}' does not exist, creating...`);
        await this.minioClient.makeBucket(bucket);
        this.logger.log(`Bucket '${bucket}' created successfully`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to create bucket '${bucket}': ${error.message}`,
      );
      throw error;
    }
  }
}

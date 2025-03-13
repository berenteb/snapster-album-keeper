import { randomUUID } from "node:crypto";

import { Injectable, OnModuleInit } from "@nestjs/common";

import { MinioService, MinioUploader } from "../minio/minio.service";

@Injectable()
export class FileService implements OnModuleInit {
  private uploader: MinioUploader;

  constructor(private readonly minioService: MinioService) {}

  async onModuleInit() {
    this.uploader = await this.minioService.createUploader("uploads");
  }

  async uploadFile(userId: string, file: Express.Multer.File) {
    return this.uploader.upload(
      file.buffer,
      this.getFileName(
        userId,
        `${file.originalname}-${this.generateId()}.${file.mimetype.split("/")[1]}`,
      ),
    );
  }

  async getFileUrl(fileName: string) {
    return this.uploader.getSignedUrl(fileName, 60 * 60);
  }

  async deleteFile(userId: string, fileName: string) {
    return this.uploader.delete(this.getFileName(userId, fileName));
  }

  private getFileName(userId: string, fileName: string) {
    return `${userId}/${fileName}`;
  }

  private generateId() {
    return randomUUID();
  }
}

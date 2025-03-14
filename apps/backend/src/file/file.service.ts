import { randomUUID } from "node:crypto";

import { Injectable, OnModuleInit } from "@nestjs/common";
import { File } from "@prisma/client";
import * as sharp from "sharp";

import { MinioService, MinioUploader } from "../minio/minio.service";
import { FileDto } from "./file.dto";

@Injectable()
export class FileService implements OnModuleInit {
  private uploader: MinioUploader;
  private readonly MAX_DIMENSION = 2000;

  constructor(private readonly minioService: MinioService) {}

  async onModuleInit() {
    this.uploader = await this.minioService.createUploader("uploads");
  }

  async uploadFile(userId: string, file: Express.Multer.File) {
    const fileName = `${this.removeExtension(file.originalname)}-${this.generateId()}.${file.mimetype.split("/")[1]}`;

    const resizedBuffer = await this.resizeImageIfNeeded(
      file.buffer,
      file.mimetype,
    );

    await this.uploader.upload(
      resizedBuffer,
      this.getFileName(userId, fileName),
    );
    return fileName;
  }

  async getFileUrl(userId: string, fileName: string) {
    return this.uploader.getSignedUrl(
      this.getFileName(userId, fileName),
      60 * 60,
    );
  }

  async getFileDto(userId: string, file: File): Promise<FileDto> {
    return {
      id: file.id,
      userId: file.userId,
      updatedAt: file.updatedAt,
      name: file.name,
      createdAt: file.createdAt,
      url: await this.getFileUrl(userId, file.name),
    };
  }

  async getFileDtos(userId: string, files: File[]): Promise<FileDto[]> {
    return Promise.all(
      files.map(async (file) => this.getFileDto(userId, file)),
    );
  }

  async deleteFile(userId: string, fileName: string) {
    return this.uploader.delete(this.getFileName(userId, fileName));
  }

  private async resizeImageIfNeeded(
    buffer: Buffer,
    mimeType: string,
  ): Promise<Buffer> {
    if (!mimeType.startsWith("image/")) {
      return buffer;
    }

    try {
      const metadata = await sharp(buffer).metadata();

      if (
        (metadata.width && metadata.width > this.MAX_DIMENSION) ||
        (metadata.height && metadata.height > this.MAX_DIMENSION)
      ) {
        return await sharp(buffer)
          .resize({
            width:
              metadata.width && metadata.width > this.MAX_DIMENSION
                ? this.MAX_DIMENSION
                : undefined,
            height:
              metadata.height && metadata.height > this.MAX_DIMENSION
                ? this.MAX_DIMENSION
                : undefined,
            fit: "inside",
            withoutEnlargement: true,
          })
          .toBuffer();
      }
    } catch (error) {
      console.error("Error resizing image:", error);
    }

    return buffer;
  }

  private getFileName(userId: string, fileName: string) {
    return `${userId}/${fileName}`;
  }

  private removeExtension(fileName: string) {
    return fileName.split(".").slice(0, -1).join(".");
  }

  private generateId() {
    return randomUUID();
  }
}

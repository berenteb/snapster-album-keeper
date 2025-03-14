import { randomUUID } from "node:crypto";

import { Injectable, OnModuleInit } from "@nestjs/common";
import { File } from "@prisma/client";

import { MinioService, MinioUploader } from "../minio/minio.service";
import { FileDto } from "./file.dto";

@Injectable()
export class FileService implements OnModuleInit {
  private uploader: MinioUploader;

  constructor(private readonly minioService: MinioService) {}

  async onModuleInit() {
    this.uploader = await this.minioService.createUploader("uploads");
  }

  async uploadFile(userId: string, file: Express.Multer.File) {
    const fileName = `${this.removeExtension(file.originalname)}-${this.generateId()}.${file.mimetype.split("/")[1]}`;
    await this.uploader.upload(file.buffer, this.getFileName(userId, fileName));
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

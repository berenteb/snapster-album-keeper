import {
  BadRequestException,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import environment from "src/config/environment";
import { PrismaService } from "src/prisma/prisma.service";

import { FileDetailDto, FileListItemDto } from "./file.dto";
import { FileService } from "./file.service";

@Controller("files")
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly userId = "default";

  @Get()
  @ApiOperation({ summary: "Get all files" })
  @ApiResponse({
    status: 200,
    description: "The list of files",
    type: FileListItemDto,
    isArray: true,
  })
  async getFiles(): Promise<FileListItemDto[]> {
    return this.prismaService.file.findMany({
      where: {
        userId: this.userId,
      },
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a file by ID" })
  @ApiResponse({
    status: 200,
    description: "The file",
    type: FileDetailDto,
  })
  @ApiNotFoundResponse({
    description: "The file was not found",
  })
  async getFile(@Param("id") id: string): Promise<FileDetailDto> {
    const file = await this.prismaService.file.findUnique({
      where: {
        id,
        userId: this.userId,
      },
    });
    if (!file) throw new NotFoundException("File not found");
    return {
      ...file,
      url: await this.fileService.getFileUrl(file.name),
    };
  }

  @Post()
  @ApiOperation({ summary: "Upload a file" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 201,
    description: "The file was uploaded",
    type: FileListItemDto,
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "The file to upload",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: environment().upload.maxFileSize,
            message: "fileTooLarge",
          }),
          new FileTypeValidator({
            fileType: /image\/(png|jpeg|jpg)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<FileListItemDto> {
    const uploadedFile = await this.fileService.uploadFile(this.userId, file);
    return this.prismaService.file.create({
      data: {
        name: uploadedFile,
        userId: this.userId,
      },
    });
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a file" })
  @ApiResponse({
    status: 200,
    description: "The file was deleted",
  })
  async deleteFile(@Param("id") id: string): Promise<void> {
    const file = await this.prismaService.file.findUnique({
      where: {
        id,
        userId: this.userId,
      },
    });
    if (!file) return;

    await this.prismaService.$transaction(async (tx) => {
      await this.fileService.deleteFile(this.userId, file.name);
      return tx.file.delete({
        where: {
          id,
          userId: this.userId,
        },
      });
    });
  }
}

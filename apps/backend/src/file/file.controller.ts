import {
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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserDto } from "../auth/dto/auth.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import environment from "../config/environment";
import { PrismaService } from "../prisma/prisma.service";
import { FileDto } from "./file.dto";
import { FileService } from "./file.service";

@Controller("files")
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all files" })
  @ApiResponse({
    status: 200,
    description: "The list of files",
    type: FileDto,
    isArray: true,
  })
  async getFiles(@CurrentUser() user: UserDto): Promise<FileDto[]> {
    const files = await this.prismaService.file.findMany({
      where: {
        userId: user.id,
      },
    });
    return this.fileService.getFileDtos(user.id, files);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a file by ID" })
  @ApiResponse({
    status: 200,
    description: "The file",
    type: FileDto,
  })
  @ApiNotFoundResponse({
    description: "The file was not found",
  })
  async getFile(
    @Param("id") id: string,
    @CurrentUser() user: UserDto,
  ): Promise<FileDto> {
    const file = await this.prismaService.file.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!file) throw new NotFoundException("File not found");
    return this.fileService.getFileDto(user.id, file);
  }

  @Post()
  @ApiOperation({ summary: "Upload a file" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 201,
    description: "The file was uploaded",
    type: FileDto,
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
    @CurrentUser() user: UserDto,
  ): Promise<FileDto> {
    const uploadedFile = await this.fileService.uploadFile(user.id, file);
    const createdFile = await this.prismaService.file.create({
      data: {
        name: uploadedFile,
        userId: user.id,
      },
    });
    return this.fileService.getFileDto(user.id, createdFile);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a file" })
  @ApiResponse({
    status: 200,
    description: "The file was deleted",
  })
  async deleteFile(
    @Param("id") id: string,
    @CurrentUser() user: UserDto,
  ): Promise<void> {
    const file = await this.prismaService.file.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!file) return;

    await this.prismaService.$transaction(async (tx) => {
      await this.fileService.deleteFile(user.id, file.name);
      return tx.file.delete({
        where: {
          id,
          userId: user.id,
        },
      });
    });
  }
}

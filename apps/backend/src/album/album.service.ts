import { Injectable, NotFoundException } from "@nestjs/common";

import { FileService } from "../file/file.service";
import { PrismaService } from "../prisma/prisma.service";
import {
  AlbumDetailDto,
  AlbumPreviewDto,
  CreateAlbumDto,
} from "./dto/album.dto";

@Injectable()
export class AlbumService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async createAlbum(userId: string, createAlbumDto: CreateAlbumDto) {
    return this.prismaService.album.create({
      data: {
        name: createAlbumDto.name,
        userId,
      },
    });
  }

  async getAlbums(userId: string): Promise<AlbumPreviewDto[]> {
    const albums = await this.prismaService.album.findMany({
      where: {
        userId,
      },
      include: {
        files: {
          take: 4,
        },
        _count: {
          select: {
            files: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return Promise.all(
      albums.map(async (album) => {
        const previewImages = await Promise.all(
          album.files.map(async (file) =>
            this.fileService.getFileUrl(userId, file.name),
          ),
        );

        return {
          id: album.id,
          name: album.name,
          userId: album.userId,
          createdAt: album.createdAt,
          updatedAt: album.updatedAt,
          previewImages: previewImages.filter(
            (url): url is string => url !== null,
          ),
          // eslint-disable-next-line no-underscore-dangle
          totalImages: album._count.files,
        };
      }),
    );
  }

  async getAlbum(userId: string, albumId: string): Promise<AlbumDetailDto> {
    const album = await this.prismaService.album.findUnique({
      where: {
        id: albumId,
        userId,
      },
      include: {
        files: true,
      },
    });

    if (!album) {
      throw new NotFoundException("Album not found");
    }

    const fileDtos = await this.fileService.getFileDtos(userId, album.files);

    return {
      ...album,
      files: fileDtos,
    };
  }

  async deleteAlbum(userId: string, albumId: string): Promise<void> {
    const album = await this.prismaService.album.findUnique({
      where: {
        id: albumId,
        userId,
      },
    });

    if (!album) {
      throw new NotFoundException("Album not found");
    }

    await this.prismaService.album.delete({
      where: {
        id: albumId,
        userId,
      },
    });
  }

  async addToAlbum(
    userId: string,
    albumId: string,
    fileId: string,
  ): Promise<void> {
    const [album, file] = await Promise.all([
      this.prismaService.album.findUnique({
        where: {
          id: albumId,
          userId,
        },
      }),
      this.prismaService.file.findUnique({
        where: {
          id: fileId,
          userId,
        },
      }),
    ]);

    if (!album || !file) {
      throw new NotFoundException("Album or file not found");
    }

    await this.prismaService.album.update({
      where: {
        id: albumId,
      },
      data: {
        files: {
          connect: {
            id: fileId,
          },
        },
        updatedAt: new Date(),
      },
    });
  }

  async removeFromAlbum(
    userId: string,
    albumId: string,
    fileId: string,
  ): Promise<void> {
    const [album, file] = await Promise.all([
      this.prismaService.album.findUnique({
        where: {
          id: albumId,
          userId,
        },
      }),
      this.prismaService.file.findUnique({
        where: {
          id: fileId,
          userId,
        },
      }),
    ]);

    if (!album || !file) {
      throw new NotFoundException("Album or file not found");
    }

    await this.prismaService.album.update({
      where: {
        id: albumId,
      },
      data: {
        files: {
          disconnect: {
            id: fileId,
          },
        },
        updatedAt: new Date(),
      },
    });
  }
}

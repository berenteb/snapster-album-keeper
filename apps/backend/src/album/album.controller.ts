import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserDto } from "../auth/dto/auth.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AlbumService } from "./album.service";
import {
  AddToAlbumDto,
  AlbumDetailDto,
  AlbumDto,
  AlbumPreviewDto,
  CreateAlbumDto,
} from "./dto/album.dto";

@Controller("albums")
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({ summary: "Create a new album" })
  @ApiResponse({
    status: 201,
    description: "The album has been successfully created",
    type: AlbumDto,
  })
  async createAlbum(
    @CurrentUser() user: UserDto,
    @Body() createAlbumDto: CreateAlbumDto,
  ): Promise<AlbumDto> {
    return this.albumService.createAlbum(user.id, createAlbumDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all albums" })
  @ApiResponse({
    status: 200,
    description: "Return all albums",
    type: [AlbumPreviewDto],
  })
  async getAlbums(@CurrentUser() user: UserDto): Promise<AlbumPreviewDto[]> {
    return this.albumService.getAlbums(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get album by id" })
  @ApiResponse({
    status: 200,
    description: "Return the album",
    type: AlbumDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: "Album not found",
  })
  async getAlbum(
    @CurrentUser() user: UserDto,
    @Param("id") id: string,
  ): Promise<AlbumDetailDto> {
    return this.albumService.getAlbum(user.id, id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete album by id" })
  @ApiResponse({
    status: 200,
    description: "The album has been successfully deleted",
  })
  async deleteAlbum(
    @CurrentUser() user: UserDto,
    @Param("id") id: string,
  ): Promise<void> {
    return this.albumService.deleteAlbum(user.id, id);
  }

  @Post(":id/files")
  @ApiOperation({ summary: "Add a file to an album" })
  @ApiResponse({
    status: 200,
    description: "The file has been successfully added to the album",
  })
  async addToAlbum(
    @CurrentUser() user: UserDto,
    @Param("id") id: string,
    @Body() addToAlbumDto: AddToAlbumDto,
  ): Promise<void> {
    return this.albumService.addToAlbum(user.id, id, addToAlbumDto.fileId);
  }

  @Delete(":id/files/:fileId")
  @ApiOperation({ summary: "Remove a file from an album" })
  @ApiResponse({
    status: 200,
    description: "The file has been successfully removed from the album",
  })
  async removeFromAlbum(
    @CurrentUser() user: UserDto,
    @Param("id") id: string,
    @Param("fileId") fileId: string,
  ): Promise<void> {
    return this.albumService.removeFromAlbum(user.id, id, fileId);
  }
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { FileDto } from "src/file/file.dto";

export class CreateAlbumDto {
  @ApiProperty({
    description: "The name of the album",
    example: "Summer Vacation 2023",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AlbumDto {
  @ApiProperty({
    description: "The ID of the album",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "The name of the album",
    example: "Summer Vacation 2023",
  })
  name: string;

  @ApiProperty({
    description: "The ID of the user who owns the album",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  userId: string;

  @ApiProperty({
    description: "The date the album was created",
    example: "2023-07-15T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "The date the album was updated",
    example: "2023-07-15T10:30:00.000Z",
  })
  updatedAt: Date;
}

export class AlbumDetailDto extends AlbumDto {
  @ApiProperty({
    description: "The files in the album",
    type: [FileDto],
  })
  files: FileDto[];
}

export class AlbumPreviewDto extends AlbumDto {
  @ApiProperty({
    description: "Preview images for the album (up to 6)",
    type: [String],
  })
  previewImages: string[];

  @ApiProperty({
    description: "Total number of images in the album",
    example: 42,
  })
  totalImages: number;
}

export class AddToAlbumDto {
  @ApiProperty({
    description: "The ID of the file to add to the album",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  fileId: string;
}

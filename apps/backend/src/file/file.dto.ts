import { ApiProperty } from "@nestjs/swagger";
import { File } from "@prisma/client";
export class FileListItemDto implements File {
  @ApiProperty({
    description: "The ID of the file",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;
  @ApiProperty({
    description: "The ID of the user who owns the file",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  userId: string;
  @ApiProperty({
    description: "The date the file was updated",
    example: "2021-01-01T00:00:00.000Z",
  })
  updatedAt: Date;
  @ApiProperty({
    description: "The name of the file",
    example: "userID/file.jpg",
  })
  name: string;
  @ApiProperty({
    description: "The date the file was created",
    example: "2021-01-01T00:00:00.000Z",
  })
  createdAt: Date;
}

export class FileDetailDto extends FileListItemDto {
  @ApiProperty({
    description: "The URL of the file",
    example: "https://example.com/file.jpg",
    nullable: true,
    type: String,
  })
  url: string | null;
}

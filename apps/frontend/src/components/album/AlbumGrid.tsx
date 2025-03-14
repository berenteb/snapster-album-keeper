import { formatDate } from "date-fns";
import { Folder, Image } from "lucide-react";
import { Link } from "react-router-dom";

import { AlbumPreviewDto } from "@/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface AlbumGridProps {
  albums: AlbumPreviewDto[];
}

export default function AlbumGrid({ albums }: AlbumGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
      {albums.map((album) => (
        <Link to={`/albums/${album.id}`} key={album.id}>
          <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 h-full flex flex-col">
            <div className="p-3 pb-0">
              <h3 className="font-medium truncate">{album.name}</h3>
              <p className="text-xs text-gray-500">
                {formatDate(album.createdAt, "yyyy-MM-dd")}
              </p>
            </div>
            <CardContent className="p-3 flex-grow">
              {album.previewImages.length > 0 ? (
                <div className="grid grid-cols-2 aspect-square gap-1">
                  {album.previewImages.slice(0, 6).map((image) => (
                    <div
                      key={image}
                      className="relative aspect-square overflow-hidden bg-gray-100 rounded-md"
                    >
                      <img
                        src={image}
                        alt={image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {Array.from({
                    length: Math.max(0, 4 - album.previewImages.length),
                  }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square bg-gray-100 flex items-center justify-center rounded-md"
                    >
                      <Image className="h-6 w-6 text-gray-300" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                  <Folder className="h-12 w-12 text-gray-300" />
                </div>
              )}
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <div className="text-sm text-gray-500">
                {album.totalImages}{" "}
                {album.totalImages === 1 ? "photo" : "photos"}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

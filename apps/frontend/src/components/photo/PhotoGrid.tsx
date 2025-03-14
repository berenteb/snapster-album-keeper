import { formatDate } from "date-fns";
import { Link } from "react-router-dom";

import { FileDto } from "@/api";
import { Card, CardContent } from "@/components/ui/card";

interface PhotoGridProps {
  photos: FileDto[];
}

function PhotoGrid({ photos }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">
          No photos yet. Upload some memories!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
      {photos.map((photo) => (
        <Card
          key={photo.id}
          className="overflow-hidden group hover:shadow-md transition-all duration-300"
        >
          <div className="relative">
            <Link to={`/photo/${photo.id}`}>
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium truncate text-sm">{photo.name}</h3>
            <p className="text-xs text-gray-500">
              {formatDate(photo.createdAt, "yyyy-MM-dd")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default PhotoGrid;

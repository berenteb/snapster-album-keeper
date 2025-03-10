
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Photo, formatDate } from "@/services/photoService";

interface PhotoGridProps {
  photos: Photo[];
}

const PhotoGrid = ({ photos }: PhotoGridProps) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">No photos yet. Upload some memories!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
      {photos.map((photo) => (
        <Link to={`/photo/${photo.id}`} key={photo.id}>
          <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium truncate text-sm">{photo.name}</h3>
              <p className="text-xs text-gray-500">{formatDate(photo.createdAt)}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default PhotoGrid;

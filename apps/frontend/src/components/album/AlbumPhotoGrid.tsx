import { formatDate } from "date-fns";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { FileListItemDto } from "@/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRemoveFromAlbumMutation } from "@/hooks/use-albums";

interface AlbumPhotoGridProps {
  photos: FileListItemDto[];
  albumId: string;
}

export default function AlbumPhotoGrid({ photos, albumId }: AlbumPhotoGridProps) {
  const removeFromAlbum = useRemoveFromAlbumMutation();

  const handleRemoveFromAlbum = async (fileId: string) => {
    try {
      await removeFromAlbum.mutateAsync({ albumId, fileId });
      toast.success("Photo removed from album");
    } catch (error) {
      console.error("Failed to remove photo from album:", error);
      toast.error("Failed to remove photo from album");
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">
          No photos in this album yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden group hover:shadow-md transition-all duration-300">
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove from album?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove the photo from this album. The photo will still be available in your library.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleRemoveFromAlbum(photo.id)}
                    className="bg-red-500 hover:bg-red-600"
                    disabled={removeFromAlbum.isPending}
                  >
                    {removeFromAlbum.isPending ? "Removing..." : "Remove"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

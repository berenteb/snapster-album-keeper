import { formatDate } from "date-fns";
import { Calendar, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { FileDto } from "@/api";
import AddToAlbumDropdown from "@/components/album/AddToAlbumDropdown";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDeletePhotoMutation } from "@/hooks/use-photos";

interface PhotoListProps {
  photos: FileDto[];
}

export default function PhotoList({ photos }: PhotoListProps) {
  const deletePhoto = useDeletePhotoMutation();

  const handleDelete = async (id: string) => {
    try {
      await deletePhoto.mutateAsync(id);
      toast.success("Photo deleted successfully");
    } catch (error) {
      console.error("Failed to delete photo:", error);
      toast.error("Failed to delete photo");
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">No photos found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {photos.map((photo) => (
        <Card
          key={photo.id}
          className="overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="flex">
            <Link to={`/photo/${photo.id}`} className="w-32 h-32 flex-shrink-0">
              <div className="w-full h-full bg-gray-100 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <Link to={`/photo/${photo.id}`}>
                    <h3 className="font-medium text-lg hover:text-teal-600 transition-colors">
                      {photo.name}
                    </h3>
                  </Link>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(photo.createdAt, "MMMM d, yyyy")}
                  </div>
                </div>
                <div className="flex gap-2">
                  <AddToAlbumDropdown fileId={photo.id} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your photo from your library.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(photo.id)}
                          className="bg-red-500 hover:bg-red-600"
                          disabled={deletePhoto.isPending}
                        >
                          {deletePhoto.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="mt-auto pt-2 text-sm text-gray-500">
                Click to view details
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

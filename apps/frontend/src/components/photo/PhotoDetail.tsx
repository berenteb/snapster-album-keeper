import { formatDate } from "date-fns";
import { Calendar, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { FileDetailDto } from "@/api";
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
import { Card, CardContent } from "@/components/ui/card";
import { useDeletePhotoMutation } from "@/hooks/use-photos";

interface PhotoDetailProps {
  photo: FileDetailDto;
}

function PhotoDetail({ photo }: PhotoDetailProps) {
  const deletePhoto = useDeletePhotoMutation(photo.id);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deletePhoto.mutateAsync();
      navigate("/");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Card className="overflow-hidden">
        <div className="relative w-full max-h-[70vh] overflow-hidden bg-gray-100">
          {photo.url ? (
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{photo.name}</h1>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(photo.createdAt, "yyyy-MM-dd")}
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={() => navigate("/")}>
                Back
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your photo from your album.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
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
        </CardContent>
      </Card>
    </div>
  );
}

export default PhotoDetail;

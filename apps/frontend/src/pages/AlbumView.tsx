import { formatDate } from "date-fns";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import AddPhotosToAlbumDialog from "@/components/album/AddPhotosToAlbumDialog";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import PhotoGrid from "@/components/photo/PhotoGrid";
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
import {
  useAlbumQuery,
  useDeleteAlbumMutation,
  useRemoveFromAlbumMutation,
} from "@/hooks/use-albums";

function AlbumView() {
  const { id } = useParams<{ id: string }>();
  const albumQuery = useAlbumQuery(id);
  const deleteAlbum = useDeleteAlbumMutation();
  const removeFromAlbum = useRemoveFromAlbumMutation();
  const navigate = useNavigate();
  const [isAddPhotosDialogOpen, setIsAddPhotosDialogOpen] = useState(false);

  const handleDeleteAlbum = async () => {
    try {
      await deleteAlbum.mutateAsync(id);
      toast.success("Album deleted successfully");
      navigate("/albums");
    } catch (error) {
      console.error("Failed to delete album:", error);
      toast.error("Failed to delete album");
    }
  };

  if (albumQuery.isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      </div>
    );
  }

  if (!albumQuery.data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <PageContainer>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Album not found</h1>
            <p className="mt-2 text-gray-500">
              The album you're looking for doesn't exist or has been deleted.
            </p>
            <Button
              onClick={() => navigate("/albums")}
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Albums
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageContainer>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{albumQuery.data.name}</h1>
            <p className="text-gray-500 mt-1">
              Created on {formatDate(albumQuery.data.createdAt, "MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsAddPhotosDialogOpen(true)}
              className="bg-teal-500 hover:bg-teal-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Photos
            </Button>
            <Button variant="outline" onClick={() => navigate("/albums")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Album
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this album. The photos in the album will not be deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAlbum}
                    className="bg-red-500 hover:bg-red-600"
                    disabled={deleteAlbum.isPending}
                  >
                    {deleteAlbum.isPending ? "Deleting..." : "Delete Album"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {albumQuery.data.files.length === 0 ? (
          <div className="text-center py-12 border rounded-md bg-gray-50">
            <h3 className="text-xl font-medium mb-2">
              No photos in this album yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Add some photos to start building your collection
            </p>
            <Button
              onClick={() => setIsAddPhotosDialogOpen(true)}
              className="bg-teal-500 hover:bg-teal-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Photos
            </Button>
          </div>
        ) : (
          <PhotoGrid photos={albumQuery.data.files} />
        )}

        <AddPhotosToAlbumDialog
          open={isAddPhotosDialogOpen}
          onOpenChange={setIsAddPhotosDialogOpen}
          albumId={id}
        />
      </PageContainer>
    </div>
  );
}

export default AlbumView;

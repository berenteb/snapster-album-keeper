import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddToAlbumMutation, useAlbumQuery } from "@/hooks/use-albums";
import { usePhotosQuery } from "@/hooks/use-photos";
import { cn } from "@/lib/utils";

interface AddPhotosToAlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
}

export default function AddPhotosToAlbumDialog({
  open,
  onOpenChange,
  albumId,
}: AddPhotosToAlbumDialogProps) {
  const photosQuery = usePhotosQuery();
  const albumQuery = useAlbumQuery(albumId);
  const addToAlbum = useAddToAlbumMutation();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset selected photos when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedPhotos([]);
    }
  }, [open]);

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId],
    );
  };

  const isPhotoInAlbum = (photoId: string) => {
    return albumQuery.data?.files.some((file) => file.id === photoId) ?? false;
  };

  const handleSubmit = async () => {
    if (selectedPhotos.length === 0) return;

    setIsSubmitting(true);
    try {
      // Add each selected photo to the album
      await Promise.all(
        selectedPhotos.map((photoId) =>
          addToAlbum.mutateAsync({ albumId, fileId: photoId }),
        ),
      );
      toast.success(`Added ${selectedPhotos.length} photos to album`);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add photos to album:", error);
      toast.error("Failed to add photos to album");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Photos to Album</DialogTitle>
          <DialogDescription>
            Select photos to add to "{albumQuery.data?.name}".
          </DialogDescription>
        </DialogHeader>

        {photosQuery.isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        )}
        {photosQuery.data?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">You don't have any photos yet.</p>
          </div>
        )}
        {photosQuery.data && photosQuery.data.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
            {photosQuery.data?.map((photo) => {
              const isInAlbum = isPhotoInAlbum(photo.id);
              const isSelected = selectedPhotos.includes(photo.id);

              return (
                <div
                  key={photo.id}
                  className={cn(
                    "relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all",
                    {
                      "border-teal-500 ring-2 ring-teal-500": isSelected,
                      "border-gray-300 opacity-50": isInAlbum,
                      "border-transparent hover:border-gray-300":
                        !isSelected && !isInAlbum,
                    },
                  )}
                  onClick={() => {
                    if (!isInAlbum) {
                      togglePhotoSelection(photo.id);
                    }
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                  {isInAlbum && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="bg-white text-xs px-2 py-1 rounded">
                        Already in album
                      </div>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedPhotos.length === 0 || isSubmitting}
            className="bg-teal-500 hover:bg-teal-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              `Add ${selectedPhotos.length} Photos`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

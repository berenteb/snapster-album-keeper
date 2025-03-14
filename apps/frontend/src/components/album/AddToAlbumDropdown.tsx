import { Check, FolderPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAddToAlbumMutation, useAlbumsQuery } from "@/hooks/use-albums";

import AlbumCreateDialog from "./AlbumCreateDialog";

interface AddToAlbumDropdownProps {
  fileId: string;
}

export default function AddToAlbumDropdown({
  fileId,
}: AddToAlbumDropdownProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const albumsQuery = useAlbumsQuery();
  const addToAlbum = useAddToAlbumMutation();

  const handleAddToAlbum = async (albumId: string) => {
    try {
      await addToAlbum.mutateAsync({ albumId, fileId });
      toast.success("Added to album");
    } catch (error) {
      console.error("Failed to add to album:", error);
      toast.error("Failed to add to album");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <FolderPlus className="h-4 w-4 mr-2" />
            Add to Album
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select Album</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {albumsQuery.isLoading && (
            <div className="flex justify-center items-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            </div>
          )}
          {albumsQuery.data && albumsQuery.data.length > 0 && (
            <DropdownMenuItem disabled className="text-gray-500">
              No albums available
            </DropdownMenuItem>
          )}
          {albumsQuery.data &&
            albumsQuery.data.map((album) => (
              <DropdownMenuItem
                key={album.id}
                onClick={() => handleAddToAlbum(album.id)}
                disabled={addToAlbum.isPending}
              >
                {album.name}
                {album.previewImages.some((image) =>
                  image.includes(fileId),
                ) && <Check className="h-4 w-4 ml-auto text-green-500" />}
              </DropdownMenuItem>
            ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCreateDialogOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Create New Album
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlbumCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}

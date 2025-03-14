import { FolderPlus, Loader2 } from "lucide-react";
import { useState } from "react";

import AlbumCreateDialog from "@/components/album/AlbumCreateDialog";
import AlbumGrid from "@/components/album/AlbumGrid";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useAlbumsQuery } from "@/hooks/use-albums";

const Albums = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const albumsQuery = useAlbumsQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageContainer>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Albums</h1>
            <p className="text-gray-500 mt-1">
              Organize your photos into collections
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-teal-500 hover:bg-teal-600"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Create Album
          </Button>
        </div>

        {albumsQuery.isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        ) : albumsQuery.data?.length === 0 ? (
          <div className="text-center py-12 border rounded-md bg-gray-50">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FolderPlus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No albums yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Create your first album to organize your photos into collections
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-teal-500 hover:bg-teal-600"
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              Create Album
            </Button>
          </div>
        ) : (
          <AlbumGrid albums={albumsQuery.data || []} />
        )}

        <AlbumCreateDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </PageContainer>
    </div>
  );
};

export default Albums;

import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import PhotoDetail from "@/components/photo/PhotoDetail";
import { usePhotoQuery } from "@/hooks/use-photos";

function PhotoView() {
  const { id } = useParams<{ id: string }>();
  const photoQuery = usePhotoQuery(id);

  if (photoQuery.isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      </div>
    );
  }

  if (!photoQuery.data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <PageContainer>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Photo not found</h1>
            <p className="mt-2 text-gray-500">
              The photo you're looking for doesn't exist or has been deleted.
            </p>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageContainer>
        <PhotoDetail photo={photoQuery.data} />
      </PageContainer>
    </div>
  );
}

export default PhotoView;

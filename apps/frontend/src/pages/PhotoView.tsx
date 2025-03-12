import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import PhotoDetail from "@/components/photo/PhotoDetail";
import { getPhotoById, Photo } from "@/services/photoService";

const PhotoView = () => {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundPhoto = getPhotoById(id);

      if (foundPhoto) {
        setPhoto(foundPhoto);
      } else {
        // Photo not found, redirect to home page
        navigate("/");
      }

      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      </div>
    );
  }

  if (!photo) {
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
        <PhotoDetail photo={photo} />
      </PageContainer>
    </div>
  );
};

export default PhotoView;

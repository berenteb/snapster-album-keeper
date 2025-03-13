import { ImagePlus } from "lucide-react";
import { useState } from "react";

import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import PhotoGrid from "@/components/photo/PhotoGrid";
import PhotoUploader from "@/components/photo/PhotoUploader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePhotosQuery } from "@/hooks/use-photos";

function Index() {
  const photoListQuery = usePhotosQuery();
  const [showUploader, setShowUploader] = useState(false);
  const [activeTab, setActiveTab] = useState("grid");

  const handleUploadComplete = () => {
    setShowUploader(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageContainer>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Photos</h1>
            <p className="text-gray-500 mt-1">
              Manage and view your photo collection
            </p>
          </div>
          <Button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-teal-500 hover:bg-teal-600"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {showUploader ? "Cancel Upload" : "Upload Photo"}
          </Button>
        </div>

        {showUploader && (
          <div className="mb-8 animate-scale-in">
            <PhotoUploader onUploadComplete={handleUploadComplete} />
          </div>
        )}

        <Tabs
          defaultValue="grid"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-0">
            <PhotoGrid photos={photoListQuery.data ?? []} />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="rounded-md border">
              {photoListQuery.data?.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-500">
                    No photos yet. Upload some memories!
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {photoListQuery.data?.map((photo) => (
                    <a
                      key={photo.id}
                      href={`/photo/${photo.id}`}
                      className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{photo.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(photo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
}

export default Index;

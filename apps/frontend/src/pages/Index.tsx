import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import SortingDropdown, {
  SortDirection,
  SortField,
} from "@/components/common/SortingDropdown";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import PhotoGrid from "@/components/photo/PhotoGrid";
import PhotoList from "@/components/photo/PhotoList";
import PhotoUploader from "@/components/photo/PhotoUploader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePhotosQuery } from "@/hooks/use-photos";
import { sortItems } from "@/utils/sorting";

function Index() {
  const photoListQuery = usePhotosQuery();
  const [showUploader, setShowUploader] = useState(false);
  const [activeTab, setActiveTab] = useState("grid");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleUploadComplete = () => {
    setShowUploader(false);
    toast.success("Photo uploaded successfully!");
  };

  const sortedPhotos = photoListQuery.data
    ? sortItems(photoListQuery.data, sortField, sortDirection)
    : [];

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

        <div className="flex justify-between items-center mb-4">
          <Tabs
            defaultValue="grid"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </Tabs>

          <SortingDropdown
            sortField={sortField}
            sortDirection={sortDirection}
            onSortFieldChange={setSortField}
            onSortDirectionChange={setSortDirection}
          />
        </div>

        {photoListQuery.isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        ) : photoListQuery.data?.length === 0 ? (
          <div className="text-center py-12 border rounded-md bg-gray-50">
            <h3 className="text-xl font-medium mb-2">No photos yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Upload your first photo to get started
            </p>
            <Button
              onClick={() => setShowUploader(true)}
              className="bg-teal-500 hover:bg-teal-600"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="grid" className="mt-0">
              <PhotoGrid photos={sortedPhotos} />
            </TabsContent>
            <TabsContent value="list" className="mt-0">
              <PhotoList photos={sortedPhotos} />
            </TabsContent>
          </Tabs>
        )}
      </PageContainer>
    </div>
  );
}

export default Index;

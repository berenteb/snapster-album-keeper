
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Folders } from "lucide-react";

const Albums = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageContainer>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Albums</h1>
          <p className="text-gray-500 mt-1">Organize your photos into collections</p>
        </div>

        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Folders className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Album feature coming soon</h3>
            <p className="text-gray-500 max-w-md">
              In the next update, you'll be able to create custom albums to organize your photos.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
};

export default Albums;

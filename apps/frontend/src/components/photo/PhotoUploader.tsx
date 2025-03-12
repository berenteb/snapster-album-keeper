import { Upload, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { uploadPhoto } from "@/services/photoService";

interface PhotoUploaderProps {
  onUploadComplete: () => void;
}

const PhotoUploader = ({ onUploadComplete }: PhotoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await uploadPhoto(selectedFile);
      clearSelection();
      onUploadComplete();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
            isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />

          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative w-full aspect-video mx-auto overflow-hidden rounded-md">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={clearSelection}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="text-sm text-gray-500 truncate">
                {selectedFile?.name} ({Math.round(selectedFile?.size! / 1024)}{" "}
                KB)
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={clearSelection}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  {isUploading ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                <Upload className="h-6 w-6 text-teal-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop your image here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <Button
                variant="outline"
                type="button"
                onClick={handleButtonClick}
                className="mt-2"
              >
                Browse Files
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoUploader;

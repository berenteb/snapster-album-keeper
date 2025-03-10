
import { toast } from "sonner";

export interface Photo {
  id: string;
  url: string;
  name: string;
  createdAt: Date;
  size?: number;
}

// In a real application, this would be stored in a database
let photos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    name: "Working from Home",
    createdAt: new Date("2023-01-15"),
    size: 2400000
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    name: "Coding Setup",
    createdAt: new Date("2023-02-20"),
    size: 1800000
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    name: "Circuit Board",
    createdAt: new Date("2023-03-10"),
    size: 3200000
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    name: "Programming Time",
    createdAt: new Date("2023-04-05"),
    size: 2900000
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    name: "MacBook Work",
    createdAt: new Date("2023-05-12"),
    size: 2100000
  }
];

export const getAllPhotos = (): Photo[] => {
  return [...photos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getPhotoById = (id: string): Photo | undefined => {
  return photos.find(photo => photo.id === id);
};

export const uploadPhoto = (file: File): Promise<Photo> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      // In a real app, you would upload to a server or cloud storage
      const reader = new FileReader();
      reader.onload = () => {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url: reader.result as string,
          name: file.name,
          createdAt: new Date(),
          size: file.size
        };
        
        photos = [newPhoto, ...photos];
        toast.success("Photo uploaded successfully");
        resolve(newPhoto);
      };
      reader.readAsDataURL(file);
    }, 1000);
  });
};

export const deletePhoto = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      photos = photos.filter(photo => photo.id !== id);
      toast.success("Photo deleted successfully");
      resolve();
    }, 500);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

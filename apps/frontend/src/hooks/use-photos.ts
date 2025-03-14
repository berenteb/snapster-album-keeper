import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deletePhoto,
  getPhoto,
  getPhotos,
  uploadPhoto,
} from "@/services/photo.service";

export const photosKeys = {
  all: ["photos"] as const,
  list: () => [...photosKeys.all, "list"] as const,
  details: (id: string) => [...photosKeys.all, "details", id] as const,
};

export function usePhotosQuery() {
  return useQuery({
    queryKey: photosKeys.list(),
    queryFn: getPhotos,
  });
}

export function usePhotoQuery(id: string) {
  return useQuery({
    queryKey: photosKeys.details(id),
    queryFn: () => getPhoto(id),
  });
}

export function useUploadPhotoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photosKeys.list() });
    },
  });
}

export function useDeletePhotoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photosKeys.list() });
    },
  });
}

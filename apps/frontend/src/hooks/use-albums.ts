import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addToAlbum,
  createAlbum,
  deleteAlbum,
  getAlbum,
  getAlbums,
  removeFromAlbum,
} from "@/services/album.service";

export const albumKeys = {
  all: ["albums"] as const,
  list: () => [...albumKeys.all, "list"] as const,
  details: (id: string) => [...albumKeys.all, "details", id] as const,
};

export function useAlbumsQuery() {
  return useQuery({
    queryKey: albumKeys.list(),
    queryFn: getAlbums,
  });
}

export function useAlbumQuery(id: string) {
  return useQuery({
    queryKey: albumKeys.details(id),
    queryFn: () => getAlbum(id),
    enabled: Boolean(id),
  });
}

export function useCreateAlbumMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createAlbum(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.list() });
    },
  });
}

export function useDeleteAlbumMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAlbum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.list() });
    },
  });
}

export function useAddToAlbumMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumId, fileId }: { albumId: string; fileId: string }) =>
      addToAlbum(albumId, fileId),
    onSuccess: (_, { albumId }) => {
      queryClient.invalidateQueries({ queryKey: albumKeys.details(albumId) });
      queryClient.invalidateQueries({ queryKey: albumKeys.list() });
    },
  });
}

export function useRemoveFromAlbumMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumId, fileId }: { albumId: string; fileId: string }) =>
      removeFromAlbum(albumId, fileId),
    onSuccess: (_, { albumId }) => {
      queryClient.invalidateQueries({ queryKey: albumKeys.details(albumId) });
      queryClient.invalidateQueries({ queryKey: albumKeys.list() });
    },
  });
}

import { AlbumApi } from "../api";
import { setupApi } from "../lib/api.utils";

const albumApi = setupApi(AlbumApi);

export async function getAlbums() {
  const response = await albumApi.albumControllerGetAlbums();
  return response.data;
}

export async function getAlbum(id: string) {
  const response = await albumApi.albumControllerGetAlbum(id);
  return response.data;
}

export async function createAlbum(name: string) {
  const response = await albumApi.albumControllerCreateAlbum({ name });
  return response.data;
}

export async function deleteAlbum(id: string) {
  const response = await albumApi.albumControllerDeleteAlbum(id);
  return response.data;
}

export async function addToAlbum(albumId: string, fileId: string) {
  const response = await albumApi.albumControllerAddToAlbum(albumId, {
    fileId,
  });
  return response.data;
}

export async function removeFromAlbum(albumId: string, fileId: string) {
  const response = await albumApi.albumControllerRemoveFromAlbum(
    albumId,
    fileId,
  );
  return response.data;
}

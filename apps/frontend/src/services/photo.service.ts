import { FileApi } from "../api";
import { setupApi } from "../lib/api.utils";

const fileApi = setupApi(FileApi);

export async function getPhotos() {
  const response = await fileApi.fileControllerGetFiles();
  return response.data;
}

export async function getPhoto(id: string) {
  const response = await fileApi.fileControllerGetFile(id);
  return response.data;
}

export async function uploadPhoto(file: File) {
  const response = await fileApi.fileControllerUploadFile(file);
  return response.data;
}

export async function deletePhoto(id: string) {
  const response = await fileApi.fileControllerDeleteFile(id);
  return response.data;
}

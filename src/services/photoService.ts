import { Photo } from "../types";
import { API_ENDPOINTS } from '../config/api';
import { apiRequest } from './httpClient';

type UploadPhotoResponse = {
  photo?: {
    id: string;
    imageUrl: string;
    createdAt: number | string;
    senderId: string;
  };
};

type PhotoListResponse = {
  items?: Array<{
    id: string;
    imageUrl: string;
    createdAt: number | string;
    senderId: string;
  }>;
};

function normalizePhoto(item: {
  id: string;
  imageUrl: string;
  createdAt: number | string;
  senderId: string;
}): Photo {
  return {
    id: item.id,
    imageUrl: item.imageUrl,
    senderId: item.senderId,
    createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.parse(item.createdAt),
  };
}

export const uploadPhoto = async (
  imageUri: string,
  senderId: string
): Promise<Photo> => {
  const formData = new FormData();
  formData.append('senderId', senderId);
  formData.append('file', {
    uri: imageUri,
    name: `photo-${Date.now()}.jpg`,
    type: 'image/jpeg',
  } as unknown as Blob);

  const payload = await apiRequest<UploadPhotoResponse>(API_ENDPOINTS.photos, {
    method: 'POST',
    body: formData,
  });

  if (!payload.photo) {
    throw new Error('Upload response does not include photo data');
  }

  return normalizePhoto(payload.photo);
};

export const getPhotos = async (): Promise<Photo[]> => {
  const payload = await apiRequest<PhotoListResponse>(API_ENDPOINTS.photos);
  return (payload.items ?? []).map(normalizePhoto);
};

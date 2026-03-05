import { Photo } from "../types";

let fakeDatabase: Photo[] = [];

export const uploadPhoto = async (
  imageUri: string,
  senderId: string
): Promise<Photo> => {
  // 🔥 FAKE API CALL
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 1000));

  const newPhoto: Photo = {
    id: Date.now().toString(),
    imageUrl: imageUri,
    createdAt: Date.now(),
    senderId,
  };

  fakeDatabase.unshift(newPhoto);

  return newPhoto;
};

export const getPhotos = async (): Promise<Photo[]> => {
  return fakeDatabase;
};

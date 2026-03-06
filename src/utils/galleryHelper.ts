 import { launchImageLibrary } from "react-native-image-picker";
import { PERMISSIONS, RESULTS, request, check } from "react-native-permissions";
import { Platform, Alert } from "react-native";

export const openPhoneGallery = async (onImageSelected: (uri: string) => void) => {
  try {
    const permission = Platform.OS === "android" 
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE 
      : PERMISSIONS.IOS.PHOTO_LIBRARY;

    const permissionResult = await check(permission);

    if (permissionResult === RESULTS.GRANTED) {
      launchGallery(onImageSelected);
    } else {
      const requestResult = await request(permission);
      if (requestResult === RESULTS.GRANTED) {
        launchGallery(onImageSelected);
      } else if (requestResult === RESULTS.BLOCKED) {
        Alert.alert(
          "Quyền bị khóa",
          "Vui lòng vào Cài đặt > Quyền > Thư viện để cấp quyền"
        );
      } 
    }
  } catch (error) {
    console.log("Lỗi:", error);
  }
};

const launchGallery = async (onImageSelected: (uri: string) => void) => {
  const result = await launchImageLibrary({
    mediaType: "photo",
  });

  if (result.assets && result.assets[0].uri) {
    onImageSelected(result.assets[0].uri);
  }
};

import React, { useEffect, useState } from "react";
import { View, Button, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { PERMISSIONS, RESULTS, request, check } from "react-native-permissions";
import { Platform } from "react-native";

export default function GalleryScreen() {
  const navigation = useNavigation<any>();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkGalleryPermission();
  }, []);

  const checkGalleryPermission = async () => {
    try {
      const permission = Platform.OS === "android" 
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE 
        : PERMISSIONS.IOS.PHOTO_LIBRARY;

      const result = await check(permission);
      setHasPermission(result === RESULTS.GRANTED);
    } catch (error) {
      console.log("Lỗi kiểm tra quyền:", error);
    }
  };

  const requestGalleryPermission = async () => {
    try {
      const permission = Platform.OS === "android" 
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE 
        : PERMISSIONS.IOS.PHOTO_LIBRARY;

      const result = await request(permission);
      
      if (result === RESULTS.GRANTED) {
        setHasPermission(true);
        openGallery();
      } else if (result === RESULTS.DENIED) {
        Alert.alert("Từ chối", "Vui lòng cấp quyền truy cập thư viện");
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          "Quyền bị khóa",
          "Vui lòng vào Cài đặt > Quyền > Thư viện để cấp quyền"
        );
      }
    } catch (error) {
      console.log("Lỗi yêu cầu quyền:", error);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
    });

    if (result.assets && result.assets[0].uri) {
      navigation.navigate("Send", {
        imageUri: result.assets[0].uri,
      });
    }
  };

  const handlePress = () => {
    if (hasPermission) {
      openGallery();
    } else {
      requestGalleryPermission();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button 
        title="Chọn ảnh từ thư viện" 
        onPress={handlePress}
      />
    </View>
  );
}

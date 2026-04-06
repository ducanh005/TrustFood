import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  useWindowDimensions,
} from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { openPhoneGallery } from "../../utils/galleryHelper";
import { moderateScale, scaleFont, verticalScale } from '../../utils/responsive';

export default function CameraScreen() {
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const navigation = useNavigation<any>();
  const { width: screenWidth } = useWindowDimensions();

  const [hasPermission, setHasPermission] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Mọi người");
  const frameWidth = Math.min(screenWidth - moderateScale(16), moderateScale(380));
  const frameHeight = frameWidth * 0.92;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!device) {
    return (
      <View style={styles.centerFallback}>
        <Text style={styles.fallbackTitle}>Không tìm thấy camera</Text>
        <Text style={styles.fallbackText}>Thiết bị/emulator hiện tại không có camera khả dụng.</Text>
        <TouchableOpacity style={styles.fallbackBtn} onPress={() => navigation.navigate('Discover')}>
          <Text style={styles.fallbackBtnText}>Mở Khám phá</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centerFallback}>
        <Text style={styles.fallbackTitle}>Chưa có quyền Camera</Text>
        <Text style={styles.fallbackText}>Hãy cấp quyền camera để dùng màn chụp ảnh.</Text>
        <TouchableOpacity style={styles.fallbackBtn} onPress={() => Linking.openSettings()}>
          <Text style={styles.fallbackBtnText}>Mở Cài đặt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fallbackGhostBtn} onPress={() => navigation.navigate('Discover')}>
          <Text style={styles.fallbackGhostText}>Bỏ qua và vào Khám phá</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await camera.current?.takePhoto();
    if (photo) {
      navigation.navigate("Send", {
        imageUri: "file://" + photo.path,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.avatar} />
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setDropdownOpen(!dropdownOpen)}
        >
          <Text style={styles.dropdownText}>{selectedOption} ▾</Text>
        </TouchableOpacity>
        
        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedOption("Mọi người");
                setDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>Mọi người</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedOption("Chỉ mình tôi");
                setDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>Chỉ mình tôi</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.frameContainer}>
        <View style={[styles.frame, { width: frameWidth, height: frameHeight, borderRadius: moderateScale(30) }]}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive
            photo
          />
          <View style={styles.flashBadge}>
            <Text style={styles.badgeText}>⚡</Text>
          </View>
          <View style={styles.zoomBadge}>
            <Text style={styles.badgeText}>1x</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomPanel}>
        <View style={styles.modeContainer}>
          <View style={styles.modeDots}>
            <View style={styles.dotActive} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.modeText}>Chụp ảnh</Text>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.smallBtn}
            onPress={() => openPhoneGallery((imageUri) => {
              navigation.navigate("Send", { imageUri });
            })}
          >
            <Ionicons name="images" size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureWrapper} onPress={takePicture}>
            <View style={styles.captureBtn} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallBtn}>
            <Ionicons name="camera-reverse" size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.explore}>
          <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
            <Text style={styles.exploreText}>Khám phá</Text>
          </TouchableOpacity>
          <Ionicons name="chevron-down" size={moderateScale(14)} color="#8A8A8A" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centerFallback: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(24),
  },
  fallbackTitle: {
    color: '#fff',
    fontSize: scaleFont(20),
    fontWeight: '700',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  fallbackText: {
    color: '#bbb',
    fontSize: scaleFont(14),
    textAlign: 'center',
    marginBottom: verticalScale(18),
  },
  fallbackBtn: {
    backgroundColor: '#FFD400',
    paddingHorizontal: moderateScale(18),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(18),
    marginBottom: verticalScale(10),
  },
  fallbackBtnText: {
    color: '#111',
    fontWeight: '700',
  },
  fallbackGhostBtn: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(8),
  },
  fallbackGhostText: {
    color: '#FFD400',
    fontSize: scaleFont(13),
  },

  topBar: {
    position: "absolute",
    top: verticalScale(50),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    zIndex: 20,
  },

  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#999",
    position: "absolute",
    left: moderateScale(20),
  },

  dropdown: {
    backgroundColor: "#333",
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
  },

  dropdownText: { color: "#fff" },

  dropdownMenu: {
    position: "absolute",
    top: verticalScale(35),
    backgroundColor: "#222",
    borderRadius: moderateScale(12),
    overflow: "hidden",
    minWidth: moderateScale(150),
    zIndex: 30,
  },

  dropdownItem: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  dropdownItemText: {
    color: "#fff",
    fontSize: scaleFont(14),
  },

  frameContainer: {
    position: "absolute",
    top: verticalScale(150),
    width: "100%",
    alignItems: "center",
  },

  frame: {
    backgroundColor: "rgba(0,0,0,0.4)",
    overflow: "hidden",
    position: "relative",
  },

  flashBadge: {
    position: "absolute",
    top: verticalScale(10),
    left: moderateScale(10),
  },

  zoomBadge: {
    position: "absolute",
    top: verticalScale(10),
    right: moderateScale(10),
  },

  bottomPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#000",
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(18),
    zIndex: 12,
  },

  modeContainer: {
    alignItems: "center",
    marginBottom: verticalScale(8),
  },

  modeDots: {
    flexDirection: "row",
    marginBottom: verticalScale(2),
  },

  dotActive: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#FFD400",
    marginHorizontal: moderateScale(4),
  },

  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#555",
    marginHorizontal: moderateScale(4),
  },

  modeText: {
    color: "#fff",
    fontSize: scaleFont(12),
  },

  bottomBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  smallBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
  },

  captureWrapper: {
    borderWidth: 3,
    borderColor: "#FFD400",
    borderRadius: moderateScale(50),
    padding: moderateScale(5),
  },

  captureBtn: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    backgroundColor: "#fff",
  },

  explore: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: verticalScale(6),
  },

  badgeText: {
    color: "#fff",
  },

  exploreText: {
    color: "#FFD400",
    fontSize: scaleFont(13),
  },
});

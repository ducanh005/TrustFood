import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
export default function CameraScreen() {
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const navigation = useNavigation<any>();

  const [hasPermission, setHasPermission] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Mọi người");

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!device || !hasPermission) return null;

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
        <View style={styles.frame}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive
            photo
          />
          <View style={styles.flashBadge}>
            <Text style={{ color: "#fff" }}>⚡</Text>
          </View>
          <View style={styles.zoomBadge}>
            <Text style={{ color: "#fff" }}>1x</Text>
          </View>
        </View>

        <View style={styles.modeDots}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
        </View>

        <Text style={styles.modeText}>Chụp ảnh</Text>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.smallBtn}
          onPress={() => navigation.navigate("Gallery")}
        >
          <Ionicons name="images" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureWrapper} onPress={takePicture}>
          <View style={styles.captureBtn} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn}>
          <Ionicons name="camera-reverse" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.explore}>
        <Text style={{ color: "#FFD400" }}>Khám phá</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  topBar: {
    position: "absolute",
    top: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#999",
    position: "absolute",
    left: 20,
  },

  dropdown: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20, 
  },

  dropdownText: { color: "#fff" },

  dropdownMenu: {
    position: "absolute",
    top: 35,
    backgroundColor: "#222",
    borderRadius: 12,
    overflow: "hidden",
    minWidth: 150,
    zIndex: 10,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  dropdownItemText: {
    color: "#fff",
    fontSize: 14,
  },

  frameContainer: {
    position: "absolute",
    top: 120,
    width: "100%",
    alignItems: "center",
  },

  frame: {
    width: 360,
    height: 360,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.4)",
    overflow: "hidden",
    position: "relative",
  },

  flashBadge: {
    position: "absolute",
    top: 10,
    left: 10,
  },

  zoomBadge: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  modeDots: {
    flexDirection: "row",
    marginTop: 12,
  },

  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD400",
    marginHorizontal: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555",
    marginHorizontal: 4,
  },

  modeText: {
    color: "#fff",
    marginTop: 6,
  },

  bottomBar: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  smallBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  captureWrapper: {
    borderWidth: 3,
    borderColor: "#FFD400",
    borderRadius: 50,
    padding: 5,
  },

  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
  },

  explore: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
});
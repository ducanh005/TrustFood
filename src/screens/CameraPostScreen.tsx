import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  PanResponder,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { openPhoneGallery } from "../utils/galleryHelper";
import { uploadPhoto } from "../services/photoService";

export default function CameraPostScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { imageUri } = route.params;

  const [mode, setMode] = useState<"send" | "review">("send");
  const [rating, setRating] = useState(4);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Mọi người");

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -50 && mode === "send") {
          setMode("review");
        }
        if (g.dx > 50 && mode === "review") {
          setMode("send");
        }
      },
    })
  ).current;

  const handleSend = async () => {
    try {
      setLoading(true);
      await uploadPhoto(imageUri, "currentUserId");
      setLoading(false);
      Alert.alert("Thành công", "Ảnh đã được gửi");
      navigation.popToTop();
    } catch {
      setLoading(false);
      Alert.alert("Lỗi", "Gửi thất bại");
    }
  };

return (
    <View style={styles.container}>
      {/* TOP BAR */}
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

      {/* SEND MODE */}
      {mode === "send" && (
        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <View style={styles.flashBadge}>
              <Text style={styles.badgeText}>⚡</Text>
            </View>
            <View style={styles.zoomBadge}>
              <Text style={styles.badgeText}>1x</Text>
            </View>
          </View>
        </View>
      )}

      {/* REVIEW MODE */}
      {mode === "review" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>

          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <Ionicons
                  name={i <= rating ? "star" : "star-outline"}
                  size={32}
                  color="#FFD400"
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Vị trí</Text>
          <View style={styles.input}>
            <Ionicons name="location" size={18} color="#FFD400" />
            <TextInput
              placeholder="Nhập địa chỉ"
              placeholderTextColor="#999"
              style={styles.textInput}
            />
          </View>

          <Text style={styles.label}>Tên nhà hàng</Text>
          <View style={styles.input}>
            <TextInput
              placeholder="Tên nhà hàng"
              placeholderTextColor="#999"
              style={styles.textInput}
            />
          </View>

          <Text style={styles.label}>Giá cả</Text>
          <View style={styles.input}>
            <TextInput
              placeholder="200.000 - 300.000 VND"
              placeholderTextColor="#999"
              style={styles.textInput}
            />
          </View>

          <Text style={styles.label}>Giờ mở cửa</Text>
          <View style={styles.input}>
            <TextInput
              placeholder="08:00 - 22:00"
              placeholderTextColor="#999"
              style={styles.textInput}
            />
          </View>

          <Text style={styles.label}>Đánh giá</Text>
          <View style={styles.textArea}>
            <TextInput
              placeholder="Viết đánh giá của bạn"
              placeholderTextColor="#888"
              multiline
              style={{ color: "#fff" }}
            />
          </View>
        </ScrollView>
      )}

      {/* MODE SWITCH */}
      <View style={styles.modeContainer} {...panResponder.panHandlers}>
        <TouchableOpacity
          style={styles.modeDots}
          onPress={() => setMode(mode === "send" ? "review" : "send")}
        >
          <View style={mode === "send" ? styles.dotActive : styles.dot} />
          <View style={mode === "review" ? styles.dotActive : styles.dot} />
        </TouchableOpacity>
        <Text style={styles.modeText}>
          {mode === "send" ? "Gửi ảnh" : "Đánh giá"}
        </Text>
      </View>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() =>
            openPhoneGallery((uri) => {
              navigation.replace("CameraPost", { imageUri: uri });
            })
          }
        >
          <Ionicons name="images" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureWrapper}
          onPress={handleSend}
          disabled={loading}
        >
          <View style={styles.captureBtn}>
            <Ionicons name="send" size={32} color="#000" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn}>
          <Ionicons name="camera-reverse" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  topBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 20,
    backgroundColor: "#000",
    paddingTop: 50,
    paddingBottom: 10,
  },

  avatar: {
    bottom: 6,
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

  dropdownText: {
    color: "#fff",
  },

  dropdownMenu: {
    position: "absolute",
    top: 85,
    backgroundColor: "#222",
    borderRadius: 12,
    overflow: "hidden",
    minWidth: 150,
    zIndex: 30,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  dropdownItemText: {
    color: "#fff",
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
    overflow: "hidden",
  },

  previewImage: {
    width: "100%",
    height: "100%",
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

  badgeText: {
    color: "#fff",
  },

  scrollContent: {
    paddingTop: 140,
    paddingHorizontal: 20,
    paddingBottom: 280,
  },

  imageWrapper: {
    alignItems: "center",
    marginBottom: 15,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 16,
  },

  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  label: {
    color: "#fff",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 46,
    gap: 8,
  },

  textInput: {
    flex: 1,
    color: "#fff",
  },

  textArea: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 12,
    height: 120,
  },

  modeContainer: {
    position: "absolute",
    bottom: 170,
    height: 60,
    width: "100%",
    alignItems: "center",
    paddingVertical: 6,
    backgroundColor: "#000",
    zIndex: 15,
  },

  modeDots: {
    flexDirection: "row",
    marginBottom: 4,
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
    marginTop: 0,
    fontSize: 12,
  },

  bottomBar: {
    position: "absolute",
    paddingBottom: 80,
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 8,
    zIndex: 10,
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
    alignItems: "center",
    justifyContent: "center",
  },
});
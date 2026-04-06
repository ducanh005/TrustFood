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
  useWindowDimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { openPhoneGallery } from "../../utils/galleryHelper";
import { uploadPhoto } from "../../services/photoService";
import { moderateScale, scaleFont, verticalScale } from '../../utils/responsive';

export default function CameraPostScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { imageUri } = route.params;
  const { width: screenWidth } = useWindowDimensions();

  const [mode, setMode] = useState<"send" | "review">("send");
  const [rating, setRating] = useState(4);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Mọi người");
  const frameWidth = Math.min(screenWidth - moderateScale(16), moderateScale(380));
  const frameHeight = frameWidth * 0.92;

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
          <View style={[styles.frame, { width: frameWidth, height: frameHeight, borderRadius: moderateScale(30) }]}>
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
                  size={moderateScale(32)}
                  color="#FFD400"
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Vị trí</Text>
          <View style={styles.input}>
            <Ionicons name="location" size={moderateScale(18)} color="#FFD400" />
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

      <View style={styles.bottomPanel}>
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
            <Ionicons name="images" size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureWrapper}
            onPress={handleSend}
            disabled={loading}
          >
            <View style={styles.captureBtn}>
              <Ionicons name="send" size={moderateScale(32)} color="#000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallBtn}>
            <Ionicons name="camera-reverse" size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.explore}>
          <Text style={styles.exploreText}>Khám phá</Text>
          <Ionicons name="chevron-down" size={moderateScale(14)} color="#8A8A8A" />
        </View>
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
    paddingHorizontal: moderateScale(20),
    zIndex: 20,
    backgroundColor: "#000",
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(10),
  },

  avatar: {
    bottom: verticalScale(6),
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

  dropdownText: {
    color: "#fff",
  },

  dropdownMenu: {
    position: "absolute",
    top: verticalScale(85),
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
  },

  frameContainer: {
    position: "absolute",
    top: verticalScale(150),
    width: "100%",
    alignItems: "center",
  },

  frame: {
    overflow: "hidden",
  },

  previewImage: {
    width: "100%",
    height: "100%",
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

  badgeText: {
    color: "#fff",
  },

  scrollContent: {
    paddingTop: verticalScale(140),
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(280),
  },

  imageWrapper: {
    alignItems: "center",
    marginBottom: verticalScale(15),
  },

  image: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(16),
  },

  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: verticalScale(20),
  },

  label: {
    color: "#fff",
    marginBottom: verticalScale(6),
  },

  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
    marginBottom: verticalScale(16),
    height: verticalScale(46),
    gap: moderateScale(8),
  },

  textInput: {
    flex: 1,
    color: "#fff",
  },

  textArea: {
    backgroundColor: "#2a2a2a",
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    height: verticalScale(120),
  },

  modeContainer: {
    width: "100%",
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
    marginTop: 0,
    fontSize: scaleFont(12),
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

  bottomBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: verticalScale(2),
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
    alignItems: "center",
    justifyContent: "center",
  },

  explore: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: verticalScale(6),
  },

  exploreText: {
    color: "#FFD400",
    fontSize: scaleFont(13),
  },
});
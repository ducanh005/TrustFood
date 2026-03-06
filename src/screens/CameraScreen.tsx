import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { openPhoneGallery } from "../utils/galleryHelper";

export default function CameraScreen() {
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const navigation = useNavigation<any>();

  const [hasPermission, setHasPermission] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Mọi người");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState(0); // 0 = ảnh, 1 = filter

  // Food information states
  const [location, setLocation] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [foodName, setFoodName] = useState("");
  const [rating, setRating] = useState("");

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
      setCapturedImage("file://" + photo.path);
      setActiveView(0);
    }
  };

  const handleDotPress = (viewIndex: number) => {
    setActiveView(viewIndex);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      navigation.navigate("Send", {
        imageUri: capturedImage,
        foodData: {
          location,
          restaurantName,
          priceMin,
          priceMax,
          openingTime,
          closingTime,
          foodName,
          rating,
        },
      });
      setCapturedImage(null);
      // Reset food data
      setLocation("");
      setRestaurantName("");
      setPriceMin("");
      setPriceMax("");
      setOpeningTime("");
      setClosingTime("");
      setFoodName("");
      setRating("");
    }
  };

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <>
          {/* CAMERA VIEW */}
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
                <Text style={styles.badgeText}>⚡</Text>
              </View>
              <View style={styles.zoomBadge}>
                <Text style={styles.badgeText}>1x</Text>
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
              onPress={() => openPhoneGallery((imageUri) => {
                navigation.navigate("Send", { imageUri });
              })}
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
            <Text style={styles.exploreText}>Khám phá</Text>
          </View>
        </>
      ) : (
        <>
          {/* CONTENT CONTAINER */}
          <View style={styles.contentContainer}>
            {/* PREVIEW / FILTER VIEW */}
            {activeView === 0 ? (
              <View style={styles.previewContainer}>
                <Image 
                  source={{ uri: capturedImage }} 
                  style={styles.previewImage}
                />
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setCapturedImage(null)}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.filterContainerWrapper}>
                <ScrollView style={styles.filterContainer} contentContainerStyle={styles.filterContent} scrollEnabled={true}>
                  <TouchableOpacity 
                    style={styles.backButtonFilter}
                    onPress={() => setCapturedImage(null)}
                  >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                  </TouchableOpacity>

                  <View style={styles.filterItem}>
                    <Ionicons name="location" size={20} color="#FFD400" />
                    <View style={styles.filterItemContent}>
                      <Text style={styles.filterLabel}>Vị trí</Text>
                      <TextInput
                        style={styles.filterInput}
                        placeholder="Nhập vị trí..."
                        placeholderTextColor="#666"
                        value={location}
                        onChangeText={setLocation}
                      />
                    </View>
                  </View>

                  <View style={styles.filterItem}>
                    <Ionicons name="storefront" size={20} color="#FFD400" />
                    <View style={styles.filterItemContent}>
                      <Text style={styles.filterLabel}>Tên nhà hàng</Text>
                      <TextInput
                        style={styles.filterInput}
                        placeholder="Nhập tên nhà hàng..."
                        placeholderTextColor="#666"
                        value={restaurantName}
                        onChangeText={setRestaurantName}
                      />
                    </View>
                  </View>

                  <View style={styles.filterItem}>
                    <Ionicons name="pricetag" size={20} color="#FFD400" />
                    <View style={styles.filterItemContent}>
                      <Text style={styles.filterLabel}>Giá cả</Text>
                      <View style={styles.priceRow}>
                        <TextInput
                          style={styles.filterInputFlex}
                          placeholder="Min"
                          placeholderTextColor="#666"
                          value={priceMin}
                          onChangeText={setPriceMin}
                          keyboardType="numeric"
                        />
                        <Text style={styles.priceDash}>-</Text>
                        <TextInput
                          style={styles.filterInputFlex}
                          placeholder="Max"
                          placeholderTextColor="#666"
                          value={priceMax}
                          onChangeText={setPriceMax}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.filterItem}>
                    <Ionicons name="time" size={20} color="#FFD400" />
                    <View style={styles.filterItemContent}>
                      <Text style={styles.filterLabel}>Giờ mở cửa</Text>
                      <View style={styles.priceRow}>
                        <TextInput
                          style={styles.filterInputFlex}
                          placeholder="HH:mm"
                          placeholderTextColor="#666"
                          value={openingTime}
                          onChangeText={setOpeningTime}
                        />
                        <Text style={styles.priceDash}>-</Text>
                        <TextInput
                          style={styles.filterInputFlex}
                          placeholder="HH:mm"
                          placeholderTextColor="#666"
                          value={closingTime}
                          onChangeText={setClosingTime}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.filterItem}>
                    <Ionicons name="restaurant" size={20} color="#FFD400" />
                    <View style={styles.filterItemContent}>
                      <Text style={styles.filterLabel}>Tên món ăn</Text>
                      <TextInput
                        style={styles.filterInput}
                        placeholder="Nhập tên món ăn..."
                        placeholderTextColor="#666"
                        value={foodName}
                        onChangeText={setFoodName}
                      />
                    </View>
                  </View>

                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingLabel}>Dánh giá của bạn</Text>
                    <TextInput
                      style={[styles.filterInput, styles.ratingInput]}
                      placeholder="Viết đánh giá của bạn..."
                      placeholderTextColor="#666"
                      value={rating}
                      onChangeText={setRating}
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </ScrollView>
              </View>
            )}
          </View>

          {/* DOTS NAVIGATION - RENDERED LAST FOR TOP Z-INDEX */}
          <View style={styles.dotsContainer} pointerEvents="box-none">
            <TouchableOpacity 
              style={[styles.dot2, activeView === 0 && styles.dot2Active]}
              onPress={() => handleDotPress(0)}
            />
            <TouchableOpacity 
              style={[styles.dot2, activeView === 1 && styles.dot2Active]}
              onPress={() => handleDotPress(1)}
            />
          </View>

          {/* BOTTOM ACTION BUTTONS - RENDERED LAST FOR TOP Z-INDEX */}
          <View style={styles.bottomBarPreview} pointerEvents="box-none">
            <TouchableOpacity 
              style={styles.smallBtn}
              onPress={() => setCapturedImage(null)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureWrapper} onPress={handleConfirm}>
              <Ionicons name="checkmark" size={32} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallBtn}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
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

  badgeText: {
    color: "#fff",
  },

  exploreText: {
    color: "#FFD400",
  },

  // Preview & Filter Styles
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  contentContainer: {
    flex: 1,
  },

  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  filterContainer: {
    flex: 1,
    backgroundColor: "#000",
  },

  filterContainerWrapper: {
    flex: 1,
    backgroundColor: "#000",
  },

  filterContent: {
    paddingTop: 60,
    paddingBottom: 120,
    paddingHorizontal: 16,
  },

  backButtonFilter: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
  },

  filterItemContent: {
    flex: 1,
    marginLeft: 12,
  },

  filterLabel: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },

  filterValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  ratingContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
  },

  ratingLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  ratingPlaceholder: {
    color: "#666",
    fontSize: 14,
    minHeight: 60,
    paddingVertical: 12,
  },

  filterInput: {
    color: "#fff",
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD400",
  },

  filterInputFlex: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD400",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  priceDash: {
    color: "#fff",
    fontSize: 16,
    width: 20,
    textAlign: "center",
  },

  ratingInput: {
    textAlignVertical: "top",
    paddingVertical: 12,
    minHeight: 80,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#FFD400",
    borderRadius: 8,
  },

  dotsContainer: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    zIndex: 50,
  },

  dot2: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#555",
  },

  dot2Active: {
    backgroundColor: "#FFD400",
  },

  bottomBarPreview: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 40,
  },
});
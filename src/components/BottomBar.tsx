import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";

export default function BottomBar() {
  const takePicture = async () => {

  };
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name="star-outline" size={35} color="#FFD400" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="location-outline" size={35} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.captureWrapper} onPress={takePicture}>
        <View style={styles.captureBtn} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={35} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="people-circle-outline" size={35} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#181818',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
    captureWrapper: {
    borderWidth: 3,
    borderColor: "#FFD400",
    borderRadius: 50,
    padding: 5,
  },
  captureBtn: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#fff",
  },
});

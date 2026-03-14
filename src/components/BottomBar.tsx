import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";


export default function BottomBar() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name="star-outline" size={28} color="#FFD400" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="home" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="person-outline" size={28} color="#fff" />
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
});

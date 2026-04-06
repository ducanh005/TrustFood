import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { moderateScale, scaleFont } from '../utils/responsive';


export const Navbar = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleAvatarPress = () => {
    navigation.navigate('Profile');
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleAvatarPress}>
        <View style={styles.left}>
          <View style={styles.avatarPlaceholder} />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>Bản tin</Text>
      <TouchableOpacity style={styles.right}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(36),
    paddingBottom: moderateScale(10),
    backgroundColor: '#181818',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  left: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: '#888',
  },
  title: {
    color: '#fff',
    fontSize: scaleFont(20),
    fontWeight: 'bold',
  },
  right: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
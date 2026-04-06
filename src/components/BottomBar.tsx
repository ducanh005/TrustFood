import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { moderateScale } from '../utils/responsive';

type BottomBarItem = 'star' | 'location' | 'notifications' | 'people';

type BottomBarProps = {
  activeItem?: BottomBarItem;
};

export default function BottomBar({ activeItem = 'star' }: BottomBarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const openNotReadyFeature = (featureName: string) => {
    Alert.alert('Tính năng đang phát triển', `${featureName} sẽ sớm được cập nhật.`);
  };

  const openCamera = () => {
    navigation.navigate('Camera');
  };

  const openDiscover = () => {
    navigation.navigate('Discover');
  };

  const openFriends = () => {
    navigation.navigate('Friends');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openDiscover}>
        <Ionicons name="star-outline" size={35} color={activeItem === 'star' ? '#FFD400' : '#fff'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openNotReadyFeature('Bản đồ')}>
        <Ionicons name="location-outline" size={35} color={activeItem === 'location' ? '#FFD400' : '#fff'} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.captureWrapper} onPress={openCamera}>
        <View style={styles.captureBtn} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openNotReadyFeature('Thông báo')}>
        <Ionicons
          name="notifications-outline"
          size={35}
          color={activeItem === 'notifications' ? '#FFD400' : '#fff'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={openFriends}>
        <Ionicons name="people-circle-outline" size={35} color={activeItem === 'people' ? '#FFD400' : '#fff'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    backgroundColor: '#181818',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
    captureWrapper: {
    borderWidth: 3,
    borderColor: "#FFD400",
    borderRadius: moderateScale(50),
    padding: moderateScale(5),
  },
  captureBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(40),
    backgroundColor: "#fff",
  },
});

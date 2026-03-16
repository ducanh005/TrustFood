import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';


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
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 10,
    backgroundColor: '#181818',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  left: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  avatarPlaceholder: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#888',
  },
  title: {
    color: '#fff', fontSize: 20, fontWeight: 'bold',
  },
  right: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
});
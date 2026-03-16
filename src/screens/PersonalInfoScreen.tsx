import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

const user = {
  name: 'Gazel Stornof',
  username: 'tepcon86',
  email: 'gazelstornof99@gmail.com',
  avatar: 'https://i.pravatar.cc/150?img=3',
};

export default function PersonalInfoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Profile');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thong tin ca nhan</Text>
      </View>

      <View style={styles.profileWrap}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.badge}>
            <Ionicons name="lock-closed" size={14} color="#fff" />
          </View>
        </View>
        <Text style={styles.username}>{user.username}</Text>
      </View>

      <Text style={styles.sectionLabel}>Thong tin ca nhan</Text>

      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>Ten cua ban</Text>
        <View style={styles.inputFake}>
          <Text style={styles.inputText}>{user.name}</Text>
        </View>
      </View>

      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>Dia chi email</Text>
        <View style={styles.inputFake}>
          <Text style={styles.inputText}>{user.email}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.85}>
        <Text style={styles.deleteText}>Xoa Tai Khoan</Text>
      </TouchableOpacity>

      {/* TODO(backend): Load and update profile data from API instead of hardcoded user object. */}
      {/* TODO(backend): Connect delete account action to authenticated backend endpoint. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0b09',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 35,
    fontWeight: '700',
  },
  profileWrap: {
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFC400',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0f0b09',
  },
  username: {
    color: '#aaa',
    fontSize: 18,
    marginTop: 10,
  },
  sectionLabel: {
    color: '#6f6f6f',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 18,
    fontWeight: '600',
  },
  fieldWrap: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#fff',
    fontSize: 29,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputFake: {
    backgroundColor: '#5a5a5a',
    borderRadius: 28,
    minHeight: 54,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  inputText: {
    color: '#f2f2f2',
    fontSize: 26,
  },
  deleteBtn: {
    marginTop: 'auto',
    marginBottom: 30,
    borderWidth: 1.5,
    borderColor: '#FF3030',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: {
    color: '#FF3030',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

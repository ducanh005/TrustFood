import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { getProfileData, updateProfileBio } from '../../services/profileStore';

const user = getProfileData();

export default function PersonalInfoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [bio, setBio] = useState(user.bio);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Profile');
  }, [navigation]);

  const handleBioChange = useCallback((nextBio: string) => {
    setBio(nextBio);
    updateProfileBio(nextBio);
  }, []);

  const handleCompleteEdit = useCallback(() => {
    updateProfileBio(bio);
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Profile');
  }, [bio, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        
      </View>

      <View style={styles.profileWrap}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.badge}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
        </View>
        <Text style={styles.username}>{user.username}</Text>
      </View>

      <Text style={styles.sectionLabel}>Thông tin cá nhân</Text>

      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>Sửa tiểu sử</Text>
        <TextInput
          value={bio}
          onChangeText={handleBioChange}
          multiline
          textAlignVertical="top"
          style={styles.bioInput}
          placeholder="Nhập tiểu sử của bạn"
          placeholderTextColor="#9d9d9d"
        />
      </View>

      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>Tên của bạn</Text>
        <View style={styles.inputFake}>
          <Text style={styles.inputText}>{user.name}</Text>
        </View>
      </View>

      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>Địa chỉ email</Text>
        <View style={styles.inputFake}>
          <Text style={styles.inputText}>{user.email}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.85} onPress={handleCompleteEdit}>
        <Text style={styles.deleteText}>Hoàn tất chỉnh sửa</Text>
      </TouchableOpacity>

      {/* TODO(backend): Load and update profile data from API instead of hardcoded user object. */}
      {/* TODO(backend): Connect delete account action to authenticated backend endpoint. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: '#181210',
  },
  header: {
   flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 36,
		paddingBottom: 12,
		paddingHorizontal: 16,
		backgroundColor: 'transparent',
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
    fontSize: 24,
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
    paddingLeft: 16,
    paddingRight: 16,
    color: '#6f6f6f',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 18,
    fontWeight: '600',
  },
  fieldWrap: {
    marginBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  fieldLabel: {
    color: '#fff',
    fontSize: 16,
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
    fontSize: 16,
  },
  bioInput: {
    backgroundColor: '#5a5a5a',
    borderRadius: 18,
    minHeight: 94,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: '#f2f2f2',
    fontSize: 16,
    lineHeight: 22,
  },
  deleteBtn: {
    paddingLeft: 16,
    paddingRight: 16,
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

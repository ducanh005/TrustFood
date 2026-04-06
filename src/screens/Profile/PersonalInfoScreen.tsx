import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { getProfileData, updateProfileData } from '../../services/profileStore';
import { moderateScale, scaleFont, verticalScale } from '../../utils/responsive';

export default function PersonalInfoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [profile, setProfile] = useState(() => getProfileData());
  const [bio, setBio] = useState(profile.bio);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [error, setError] = useState('');

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Profile');
  }, [navigation]);

  const handleBioChange = useCallback((nextBio: string) => {
    setBio(nextBio);
  }, []);

  const handleCompleteEdit = useCallback(() => {
    if (!name.trim()) {
      setError('Vui long nhap ten');
      return;
    }

    if (!email.includes('@')) {
      setError('Email khong hop le');
      return;
    }

    setError('');
    const next = updateProfileData({
      name: name.trim(),
      email: email.trim(),
      bio,
    });
    setProfile(next);

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Profile');
  }, [bio, email, name, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back-outline" size={moderateScale(28)} color="#fff" />
        </TouchableOpacity>
        
      </View>

      <View style={styles.profileWrap}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          <View style={styles.badge}>
            <Ionicons name="camera" size={moderateScale(14)} color="#fff" />
          </View>
        </View>
        <Text style={styles.username}>{profile.username}</Text>
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
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.inputEdit}
          placeholder="Nhap ten"
          placeholderTextColor="#9d9d9d"
        />
      </View>

      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>Địa chỉ email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.inputEdit}
          placeholder="Nhap email"
          placeholderTextColor="#9d9d9d"
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
		paddingTop: verticalScale(36),
		paddingBottom: verticalScale(12),
		paddingHorizontal: moderateScale(16),
		backgroundColor: 'transparent',
  },
  backBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(10),
  },
  headerTitle: {
    color: '#fff',
    fontSize: scaleFont(24),
    fontWeight: '700',
  },
  profileWrap: {
    alignItems: 'center',
    marginTop: verticalScale(26),
    marginBottom: verticalScale(14),
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: verticalScale(4),
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: '#FFC400',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0f0b09',
  },
  username: {
    color: '#aaa',
    fontSize: scaleFont(18),
    marginTop: verticalScale(10),
  },
  sectionLabel: {
    paddingLeft: moderateScale(16),
    paddingRight: moderateScale(16),
    color: '#6f6f6f',
    fontSize: scaleFont(15),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(18),
    fontWeight: '600',
  },
  fieldWrap: {
    marginBottom: verticalScale(20),
    paddingLeft: moderateScale(16),
    paddingRight: moderateScale(16),
  },
  fieldLabel: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  inputEdit: {
    backgroundColor: '#5a5a5a',
    borderRadius: moderateScale(28),
    minHeight: 54,
    paddingHorizontal: moderateScale(18),
    justifyContent: 'center',
    color: '#f2f2f2',
    fontSize: scaleFont(16),
  },
  bioInput: {
    backgroundColor: '#5a5a5a',
    borderRadius: moderateScale(18),
    minHeight: 94,
    paddingHorizontal: moderateScale(18),
    paddingVertical: verticalScale(14),
    color: '#f2f2f2',
    fontSize: scaleFont(16),
    lineHeight: verticalScale(22),
  },
  deleteBtn: {
    paddingLeft: moderateScale(16),
    paddingRight: moderateScale(16),
    marginTop: 'auto',
    marginBottom: verticalScale(30),
    borderWidth: 1.5,
    borderColor: '#FF3030',
    borderRadius: moderateScale(28),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  errorText: {
    color: '#ff7b7b',
    marginTop: -verticalScale(8),
    marginBottom: verticalScale(8),
    paddingHorizontal: moderateScale(16),
  },
  deleteText: {
    color: '#FF3030',
    fontSize: scaleFont(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

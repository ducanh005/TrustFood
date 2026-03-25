import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

export default function ChangePasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Profile');
  }, [navigation]);

  const isValid = useMemo(() => {
    return currentPassword.length > 0 && newPassword.length >= 8 && confirmPassword === newPassword;
  }, [confirmPassword, currentPassword, newPassword]);

  const handleSubmit = useCallback(() => {
    if (!currentPassword) {
      setError('Vui long nhap mat khau hien tai');
      setSuccess('');
      return;
    }

    if (newPassword.length < 8) {
      setError('Mat khau moi phai tu 8 ky tu');
      setSuccess('');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Xac nhan mat khau khong khop');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('Da san sang payload doi mat khau. Cho API backend de gui request.');
  }, [confirmPassword, currentPassword, newPassword]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Đổi mật khẩu</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>Nhap thong tin de san sang ket noi API doi mat khau.</Text>

        <TextInput
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Mat khau hien tai"
          placeholderTextColor="#9f9f9f"
          style={styles.input}
        />
        <TextInput
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Mat khau moi"
          placeholderTextColor="#9f9f9f"
          style={styles.input}
        />
        <TextInput
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Xac nhan mat khau moi"
          placeholderTextColor="#9f9f9f"
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <TouchableOpacity
          style={[styles.submitBtn, { opacity: isValid ? 1 : 0.65 }]}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>San sang gui API</Text>
        </TouchableOpacity>
      </View>

      {/* TODO(backend): Build change-password form and connect to authenticated password update API. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0b09',
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 46,
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#1b1714',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  text: {
    color: '#f0f0f0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#2b2520',
    borderRadius: 12,
    color: '#fff',
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 10,
  },
  submitBtn: {
    marginTop: 8,
    backgroundColor: '#ffd31a',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#101010',
    fontWeight: '700',
  },
  error: {
    color: '#ff7d7d',
    marginBottom: 8,
  },
  success: {
    color: '#9de09a',
    marginBottom: 8,
  },
});

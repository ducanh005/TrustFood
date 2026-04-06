import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { AppText } from '../../components/AppText';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { completeRegistration } from '../../services/authService';
import { ApiError } from '../../services/httpClient';
import { moderateScale, verticalScale } from '../../utils/responsive';

export default function SetNameScreen() {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'SetName'>>();

  const route = useRoute();
  const { email, password, otp } = route.params as {
    email: string;
    password: string;
    otp: string;
  };

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await completeRegistration({
        email,
        password,
        name: name.trim(),
        otp,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      const message = e instanceof ApiError ? e.message : 'Không thể tạo tài khoản';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppText variant="H3" style={styles.title}>Tên của bạn</AppText>

      <TextInput
        placeholder="Tên của bạn"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
        style={[styles.input, error && styles.inputError]}
      />

      {error ? <AppText style={styles.error}>{error}</AppText> : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary, opacity: loading ? 0.7 : 1 }]}
        onPress={handleContinue}
        disabled={loading}
      >
        <AppText variant="P1_Medium">{loading ? 'Đang tạo tài khoản...' : 'Tiếp tục'}</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: moderateScale(20), justifyContent: 'center' },
  title: { color: '#fff', textAlign: 'center', marginBottom: verticalScale(32) },
  input: {
    height: verticalScale(50),
    backgroundColor: '#1c1c1c',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    color: '#fff',
  },
  inputError: { borderWidth: 1, borderColor: 'red' },
  error: { color: 'red', marginTop: verticalScale(6) },
  button: {
    height: verticalScale(56),
    borderRadius: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
});
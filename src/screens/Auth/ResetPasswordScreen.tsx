import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AppText } from "../../components/AppText";
import { useTheme } from "../../hooks/useTheme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { resetPassword } from '../../services/authService';
import { ApiError } from '../../services/httpClient';

export default function ResetPasswordScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>>();
  const route = useRoute();
  const { email, otp } = route.params as { email: string; otp: string };

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (value: string) => {
    return value.length >= 8;
  };

  const handleComplete = async () => {
    if (!validatePassword(password)) {
      setError("Mật khẩu tối thiểu 8 ký tự");
      return;
    }

    if (password !== confirm) {
      setError("Mật khẩu không khớp");
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword({
        email,
        otp,
        newPassword: password,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      const message = e instanceof ApiError ? e.message : 'Không thể đặt lại mật khẩu';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppText variant="H3" style={styles.title}>
        Đặt lại mật khẩu
      </AppText>

      <TextInput
        placeholder="Nhập mật khẩu"
        placeholderTextColor="#666"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Nhập lại mật khẩu"
        placeholderTextColor="#666"
        secureTextEntry
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
      />

      {error ? <AppText style={styles.error}>{error}</AppText> : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary, opacity: loading ? 0.7 : 1 }]}
        onPress={handleComplete}
        disabled={loading}
      >
        <AppText>{loading ? 'Đang cập nhật...' : 'Hoàn tất'}</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20, justifyContent: "center" },
  title: { color: "#fff", textAlign: "center", marginBottom: 32 },
  input: {
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 16,
    color: "#fff",
  },
  error: { color: "red", marginBottom: 10 },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

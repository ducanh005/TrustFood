import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AppText } from "../../components/AppText";
import { useTheme } from "../../hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { requestForgotPasswordOtp } from '../../services/authService';
import { ApiError } from '../../services/httpClient';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "ForgotPassword">
    >();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRef = useRef<TextInput>(null);

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleContinue = async () => {
    if (step === "email") {
      if (!validateEmail(email)) {
        setError("Email không hợp lệ");
        return;
      }

      setError("");
      setLoading(true);

      try {
        await requestForgotPasswordOtp(email.trim());
      } catch (e) {
        const message = e instanceof ApiError ? e.message : 'Không thể gửi OTP';
        setError(message);
        setLoading(false);
        return;
      }

      await new Promise<void>(resolve => setTimeout(resolve, 250));

      setLoading(false);
      setStep("otp");

      // focus input OTP
      setTimeout(() => otpRef.current?.focus(), 200);
    } else {
      if (otp.length < 6) {
        setError("Mã xác nhận không hợp lệ");
        return;
      }

      setError("");
      navigation.navigate('ResetPassword', { email: email.trim(), otp: otp.trim() });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View>
        <AppText variant="H3" style={styles.title}>
          Quên mật khẩu
        </AppText>

        {step === "email" && (
          <>
            <AppText style={styles.label}>Email</AppText>
            <TextInput
              placeholder="Email của bạn"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, error && styles.inputError]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        )}

        {step === "otp" && (
          <>
            <AppText style={styles.label}>Mã xác nhận</AppText>

            <AppText style={styles.subText}>
              Mã đã được gửi tới{" "}
              <AppText style={{ fontWeight: "600" }}>{email}</AppText>
            </AppText>

            <TextInput
              ref={otpRef}
              placeholder="Nhập mã 6 số"
              placeholderTextColor="#666"
              value={otp}
              onChangeText={setOtp}
              style={[styles.input, error && styles.inputError]}
              keyboardType="number-pad"
              maxLength={6}
            />

            <TouchableOpacity onPress={() => setStep("email")}>
              <AppText style={styles.link}>Đổi email khác</AppText>
            </TouchableOpacity>
          </>
        )}

        {error ? <AppText style={styles.error}>{error}</AppText> : null}

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.primary,
              opacity: loading ? 0.6 : 1,
            },
          ]}
          disabled={loading}
          onPress={handleContinue}
        >
          <AppText variant="P1_Medium">
            {step === "email" ? "Gửi mã xác nhận" : "Xác nhận"}
          </AppText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 32,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
  },
  subText: {
    color: "#aaa",
    marginBottom: 8,
    fontSize: 13,
  },
  input: {
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    color: "#fff",
    marginBottom: 12,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "red",
  },
  error: {
    color: "red",
    marginTop: 4,
  },
  link: {
    color: "#FFC726",
    marginBottom: 12,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
});
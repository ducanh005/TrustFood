import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AppText } from "../../components/AppText";
import { useTheme } from "../../hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { moderateScale, scaleFont, verticalScale } from '../../utils/responsive';

export default function VerifyOTPScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");

  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join("").length !== 6) {
      setError("Vui lòng nhập đủ 6 số");
      return;
    }

    navigation.navigate("ResetPassword" as never);
  };

  return (
    <View style={styles.container}>
      <AppText variant="H3" style={styles.title}>
        Xác nhận tài khoản
      </AppText>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;   // ✅ không return gì
            }}
            style={[styles.otpInput, error && styles.inputError]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
          />
        ))}
      </View>

      {error ? <AppText style={styles.error}>{error}</AppText> : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleVerify}
      >
        <AppText>Tiếp tục</AppText>
      </TouchableOpacity>

      <TouchableOpacity disabled={countdown > 0}>
        <AppText
          style={{
            color: countdown > 0 ? "#666" : theme.colors.primary,
            marginTop: verticalScale(20),
          }}
        >
          {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại OTP"}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: moderateScale(20), justifyContent: "center" },
  title: { color: "#fff", textAlign: "center", marginBottom: verticalScale(32) },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  otpInput: {
    width: moderateScale(48),
    height: verticalScale(56),
    borderRadius: moderateScale(12),
    backgroundColor: "#1c1c1c",
    textAlign: "center",
    fontSize: scaleFont(20),
    color: "#fff",
  },
  inputError: { borderWidth: 1, borderColor: "red" },
  error: { color: "red", marginBottom: verticalScale(10), textAlign: "center" },
  button: {
    height: verticalScale(56),
    borderRadius: moderateScale(28),
    justifyContent: "center",
    alignItems: "center",
  },
});

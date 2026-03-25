import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { AppText } from '../../components/AppText';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

export default function SetNameScreen() {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'SetName'>>();

  const route = useRoute();
  const { email, password } = route.params as { email: string; password: string };

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên');
      return;
    }

    // TODO: call API tạo tài khoản
    console.log({ email, password, name });

    navigation.navigate('Login');
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
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleContinue}
      >
        <AppText variant="P1_Medium">Tiếp tục</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', textAlign: 'center', marginBottom: 32 },
  input: {
    height: 50,
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#fff',
  },
  inputError: { borderWidth: 1, borderColor: 'red' },
  error: { color: 'red', marginTop: 6 },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
});
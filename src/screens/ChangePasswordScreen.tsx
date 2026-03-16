import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

export default function ChangePasswordScreen() {
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
        <Text style={styles.title}>Đổi mật khẩu</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>Tính năng đổi mật khẩu sẽ kết nối API ở bước backend tiếp theo.</Text>
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
  },
});

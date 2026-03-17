import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type ReviewImage = {
  id: string;
  imageUrl: string;
};

const profile = {
  name: 'Gazel Stornof',
  username: 'tepcon86',
  avatar: 'https://i.pravatar.cc/300?img=12',
  followers: 50,
  following: 12,
  reviews: 20,
};

const reviewImages: ReviewImage[] = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1457666134378-6b77915bd5f2?auto=format&fit=crop&w=800&q=80' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=800&q=80' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80' },
  { id: '5', imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80' },
  { id: '6', imageUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80' },
  { id: '7', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' },
  { id: '8', imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80' },
  { id: '9', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { id: '10', imageUrl: 'https://images.unsplash.com/photo-1533777324565-a040eb52fac1?auto=format&fit=crop&w=800&q=80' },
];

export default function ProfileReviewsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const headerStats = useMemo(
    () => `${profile.followers} người theo dõi · ${profile.following} đang theo dõi · ${profile.reviews} bài đánh giá`,
    [],
  );
  const handleBack = useCallback(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      navigation.navigate('Profile');
    }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0e0907" />
      <FlatList
        data={reviewImages}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
                    <Ionicons name="arrow-back-outline" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.profileBox}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.username}>{profile.username}</Text>
              <Text style={styles.stats}>{headerStats}</Text>
            </View>

            <View style={styles.separator} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
          </View>
        )}
      />

      {/* TODO(backend): Replace hardcoded profile and review images with API response for user/{id}/reviews. */}
      {/* TODO(backend): Move followers/following/review count to server fields and refresh on focus. */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0e0907',
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 24,
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
  profileBox: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    marginBottom: 12,
  },
  name: {
    color: '#f8f1ed',
    fontSize: 31,
    fontWeight: '700',
  },
  username: {
    color: '#9f938d',
    fontSize: 19,
    marginTop: 2,
  },
  stats: {
    color: '#d7cbc5',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#231916',
    marginBottom: 14,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  card: {
    width: '32.2%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1e1512',
  },
  foodImage: {
    width: '100%',
    aspectRatio: 1,
  },
});

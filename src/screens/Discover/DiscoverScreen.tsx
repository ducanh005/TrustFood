import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import {Navbar} from '../../components/Navbar';
import BottomBar from '../../components/BottomBar';
import PostItem, { Post } from '../../components/PostItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';


// NOTE: This screen uses fake data for local development/demo.
// Backend integration points (TODOs):
// - Replace `generateFakePosts` with API call to fetch paginated posts.
// - Replace like/comment actions with API endpoints.
// - Implement real user avatars and post images stored on the server or CDN.

// Post type moved to components/PostItem.tsx

const AUTHOR_NAMES = [
  'Natalie Edwards',
  'Johnny EST',
  'Linh Tran',
  'An Nguyen',
  'Minh Ho',
];

const POST_IMAGES = [
  'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
  'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=1200',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200',
];

const AVATARS = [
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/21.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
];

function generateFakePosts(page = 1, perPage = 5): Post[] {
  const items: Post[] = [];
  for (let i = 0; i < perPage; i++) {
    const idx = ((page - 1) * perPage + i) % AUTHOR_NAMES.length;
    const id = `p-${page}-${i}`;
    items.push({
      id,
      author: AUTHOR_NAMES[idx],
      avatar: AVATARS[idx % AVATARS.length],
      rating: 4 + (i % 2),
      location: 'Nhà hàng Mười Khó, 3a Phan Đăng Lưu, Q.Phú Nhuận',
      image: POST_IMAGES[idx % POST_IMAGES.length],
      text: "Haha that's terrifying 😂",
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 10),
    });
  }
  return items;
}

type DiscoverFeedParams = {
  page: number;
  perPage: number;
};

async function fetchDiscoverFeed(params: DiscoverFeedParams): Promise<Post[]> {
  // Backend-ready signature: replace function body with API call later.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateFakePosts(params.page, params.perPage));
    }, 300);
  });
}

export default function DiscoverScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      const firstPage = await fetchDiscoverFeed({ page: 1, perPage: 6 });
      if (!mounted) {
        return;
      }
      setPosts(firstPage);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const more = await fetchDiscoverFeed({ page: nextPage, perPage: 5 });
      setPosts((p) => [...p, ...more]);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      const refreshed = await fetchDiscoverFeed({ page: 1, perPage: 6 });
      setPosts(refreshed);
      setPage(1);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Like handler (simulate API call)
  const handleLike = useCallback((id: string) => {
    setPosts((prev) => prev.map((p) =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
    // TODO: Call backend API to like/unlike post
  }, []);

  // Comment handler (placeholder)
  const handleComment = useCallback((id: string) => {
    // TODO: Navigate to comment screen or open comment modal
    // For now, just log
    console.log('Comment on', id);
  }, []);

  const handleOpenProfile = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Navbar />
      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            onLike={handleLike}
            onComment={handleComment}
            onPressAuthor={handleOpenProfile}
          />
        )}
        onEndReachedThreshold={0.6}
        onEndReached={loadMore}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  loadingMore: { padding: 16 },
  listContent: { paddingBottom: 70 },
});

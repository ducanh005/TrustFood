import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";

export type Post = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  location: string;
  image: string;
  text: string;
  likes: number;
  comments: number;
  liked?: boolean;
};

type Props = {
  post: Post;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onPressAuthor: () => void;
};

export default function PostItem({ post, onLike, onComment, onPressAuthor }: Props) {
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={onPressAuthor} activeOpacity={0.8}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerTextWrap} onPress={onPressAuthor} activeOpacity={0.8}>
          <Text style={styles.author}>{post.author}</Text>
          <View style={styles.ratingRow}>
            {[...Array(post.rating)].map((_, i) => (
              <Ionicons key={i} name="star" size={14} color="#FFD400" />
            ))}
          </View>
          <Text style={styles.location}>{post.location}</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: post.image }} style={styles.postImage} />
      <View style={styles.postFooter}>
        <Text style={styles.postText}>{post.text}</Text>
        <View style={styles.metaRow}>
          <TouchableOpacity style={styles.metaBtn} onPress={() => onLike(post.id)}>
            <Ionicons name={post.liked ? 'heart' : 'heart-outline'} size={18} color={post.liked ? '#FF3B30' : '#fff'} />
            <Text style={[styles.meta, post.liked && styles.metaLiked]}> {post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.metaBtn} onPress={() => onComment(post.id)}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
            <Text style={styles.meta}> {post.comments}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    backgroundColor: '#121212',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  headerTextWrap: { flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  author: { color: '#fff', fontWeight: '600', fontSize: 15 },
  location: { color: '#FFD400', fontSize: 12, marginTop: 2 },
  postImage: { width: '100%', height: 284, backgroundColor: '#222',borderRadius:12 },
  postFooter: { padding: 12 },
  postText: { color: '#fff', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 18 },
  meta: { color: '#fff', fontSize: 14 },
  metaLiked: { color: '#FF3B30' },
});

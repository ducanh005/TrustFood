import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import BottomBar from '../../components/BottomBar';
import { FriendSearchItem, searchFriendsApi } from '../../services/friendService';

type Friend = {
  id: string;
  name: string;
  avatar: string;
};

type TabKey = 'following' | 'followers';
type SearchSource = TabKey | 'suggestions' | 'api';

type SearchResultItem = Friend & {
  source: SearchSource;
};

const followingData: Friend[] = [
  { id: 'f-1', name: 'Matthew Stary', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'f-2', name: 'Hasley Junior', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 'f-3', name: 'Javier Stongry', avatar: 'https://i.pravatar.cc/150?img=66' },
];

const followersData: Friend[] = [
  { id: 'r-1', name: 'Matthew Stary', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'r-2', name: 'Hasley Junior', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 'r-3', name: 'Javier Stongry', avatar: 'https://i.pravatar.cc/150?img=66' },
];

const suggestionsData: Friend[] = [
  { id: 's-1', name: 'Matthew Stary', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 's-2', name: 'Hasley Junior', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 's-3', name: 'Javier Stongry', avatar: 'https://i.pravatar.cc/150?img=66' },
];

function ListSeparator() {
  return <View style={styles.separator} />;
}

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('following');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [apiResults, setApiResults] = useState<FriendSearchItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const listData = useMemo(() => {
    return activeTab === 'following' ? followingData : followersData;
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  useEffect(() => {
    if (!debouncedQuery) {
      setApiResults([]);
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    const controller = new AbortController();

    const runSearch = async () => {
      setSearchLoading(true);
      setSearchError(null);

      try {
        const results = await searchFriendsApi(debouncedQuery, controller.signal);
        setApiResults(results);
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
        setSearchError('Không thể tải kết quả. Vui lòng thử lại.');
      } finally {
        setSearchLoading(false);
      }
    };

    runSearch();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const onSearchPress = () => {
    setIsSearchOpen(true);
  };

  const onCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchInput('');
    setDebouncedQuery('');
    setApiResults([]);
    setSearchError(null);
  };

  const normalizeQuery = debouncedQuery.toLowerCase();

  const searchResults = useMemo<SearchResultItem[]>(() => {
    if (!normalizeQuery) {
      return [];
    }

    const localSources: Array<{ items: Friend[]; source: SearchSource }> = [
      { items: followingData, source: 'following' },
      { items: followersData, source: 'followers' },
      { items: suggestionsData, source: 'suggestions' },
    ];

    const localResults = localSources.flatMap(({ items, source }) =>
      items
        .filter((item) => item.name.toLowerCase().includes(normalizeQuery))
        .map((item) => ({ ...item, source })),
    );

    const remoteResults = apiResults.map((item) => ({
      id: item.id,
      name: item.name,
      avatar: item.avatar,
      source: 'api' as const,
    }));

    const seenNames = new Set<string>();
    return [...localResults, ...remoteResults].filter((item) => {
      const key = item.name.trim().toLowerCase();
      if (!key || seenNames.has(key)) {
        return false;
      }
      seenNames.add(key);
      return true;
    });
  }, [apiResults, normalizeQuery]);

  const currentQuery = searchInput.trim();

  const getActionForSource = (source: SearchSource) => {
    if (source === 'following') {
      return 'unfollow';
    }
    if (source === 'followers') {
      return 'followBack';
    }
    return 'follow';
  };

  const onUnfollow = (name: string) => {
    Alert.alert('Bỏ theo dõi', `Đã bấm bỏ theo dõi ${name}.`);
  };

  const onFollowBack = (name: string) => {
    Alert.alert('Theo dõi lại', `Đã bấm theo dõi lại ${name}.`);
  };

  const onRemoveFollower = (name: string) => {
    Alert.alert('Gỡ người theo dõi', `Đã bấm gỡ ${name}.`);
  };

  const onFollowSuggestion = (name: string) => {
    Alert.alert('Theo dõi', `Đã bấm theo dõi ${name}.`);
  };

  const renderActions = (name: string, mode: 'unfollow' | 'followBack' | 'follow') => {
    if (mode === 'followBack') {
      return (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.yellowButton} onPress={() => onFollowBack(name)}>
            <Text style={styles.yellowButtonText}>Theo dõi lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconActionButton} onPress={() => onRemoveFollower(name)}>
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      );
    }

    if (mode === 'unfollow') {
      return (
        <TouchableOpacity style={styles.darkActionButton} onPress={() => onUnfollow(name)}>
          <Text style={styles.darkActionText}>Bỏ theo dõi</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.smallYellowButton} onPress={() => onFollowSuggestion(name)}>
        <Text style={styles.smallYellowButtonText}>Theo dõi</Text>
      </TouchableOpacity>
    );
  };

  const renderFriendItem = ({ item }: { item: Friend }) => {
    const mode = activeTab === 'followers' ? 'followBack' : 'unfollow';

    return (
      <View style={styles.itemRow}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{item.name}</Text>
        </View>

        {renderActions(item.name, mode)}
      </View>
    );
  };

  const renderSuggestionItem = ({ item }: { item: Friend | SearchResultItem }) => {
    const mode = 'source' in item ? getActionForSource(item.source) : 'follow';

    return (
      <View style={styles.itemRow}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{item.name}</Text>
        </View>
        {renderActions(item.name, mode)}
      </View>
    );
  };

  const renderSuggestionsSection = () => {
    if (activeTab !== 'followers') {
      return null;
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Có thể bạn biết</Text>
        {suggestionsData.map((item, index) => (
          <View key={item.id}>
            {renderSuggestionItem({ item })}
            {index < suggestionsData.length - 1 ? <View style={styles.separator} /> : null}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          {isSearchOpen ? (
            <View style={styles.searchRow}>
              <TouchableOpacity style={styles.backSearchButton} onPress={onCloseSearch}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.searchInputWrap}>
                <Ionicons name="search-outline" size={20} color="#A6A6A6" />
                <TextInput
                  value={searchInput}
                  onChangeText={setSearchInput}
                  placeholder="Tìm bạn bè"
                  placeholderTextColor="#8E8A89"
                  style={styles.searchInput}
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="search"
                />
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Bạn bè</Text>
              <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
                <Ionicons name="search-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {isSearchOpen ? (
          <>
            {searchLoading ? <ActivityIndicator color="#F8C819" style={styles.searchLoader} /> : null}
            {searchError ? <Text style={styles.errorText}>{searchError}</Text> : null}
            {!searchLoading && currentQuery.length > 0 && searchResults.length === 0 ? (
              <Text style={styles.emptyText}>Không tìm thấy kết quả phù hợp.</Text>
            ) : null}
            {!searchLoading && searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => `${item.source}-${item.id}`}
                renderItem={renderSuggestionItem}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={ListSeparator}
                showsVerticalScrollIndicator={false}
              />
            ) : null}
          </>
        ) : (
          <>
            <View style={styles.tabsWrap}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'following' && styles.tabButtonActive]}
                onPress={() => setActiveTab('following')}
              >
                <Text style={[styles.tabText, activeTab === 'following' && styles.tabTextActive]}>Đang theo dõi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'followers' && styles.tabButtonActive]}
                onPress={() => setActiveTab('followers')}
              >
                <Text style={[styles.tabText, activeTab === 'followers' && styles.tabTextActive]}>Người theo dõi</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={listData}
              keyExtractor={(item) => item.id}
              renderItem={renderFriendItem}
              contentContainerStyle={styles.listContainer}
              ItemSeparatorComponent={ListSeparator}
              ListFooterComponent={renderSuggestionsSection}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>

      <BottomBar activeItem="people" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0706',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    minHeight: 44,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  backSearchButton: {
    marginRight: 10,
    paddingVertical: 6,
    paddingRight: 4,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1B1A',
    borderRadius: 26,
    paddingHorizontal: 14,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#302A29',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 8,
    paddingVertical: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#5B5B5B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
  },
  tabsWrap: {
    backgroundColor: '#1A1615', 
    borderRadius: 30,
    padding: 4,
    flexDirection: 'row',
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#0F0A09',
  },
  tabText: {
    color: '#8E8A89',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 16,
  },
  searchLoader: {
    marginTop: 10,
  },
  emptyText: {
    color: '#8E8A89',
    fontSize: 15,
    marginTop: 16,
  },
  errorText: {
    color: '#FF7D7D',
    fontSize: 15,
    marginTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    backgroundColor: '#383838',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  darkActionButton: {
    backgroundColor: '#1E1B1A',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginLeft: 12,
  },
  darkActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  yellowButton: {
    backgroundColor: '#F8C819',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  yellowButtonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
  iconActionButton: {
    padding: 4,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 6,
  },
  smallYellowButton: {
    backgroundColor: '#F8C819',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 12,
  },
  smallYellowButtonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#211C1A',
  },
});

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
import { moderateScale, scaleFont, verticalScale } from '../../utils/responsive';

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
            <Ionicons name="close" size={moderateScale(22)} color="#FFFFFF" />
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
                <Ionicons name="arrow-back" size={moderateScale(24)} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.searchInputWrap}>
                <Ionicons name="search-outline" size={moderateScale(20)} color="#A6A6A6" />
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
                <Ionicons name="search-outline" size={moderateScale(20)} color="#FFFFFF" />
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
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(12),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(14),
    minHeight: verticalScale(44),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  backSearchButton: {
    marginRight: moderateScale(10),
    paddingVertical: verticalScale(6),
    paddingRight: moderateScale(4),
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1B1A',
    borderRadius: moderateScale(26),
    paddingHorizontal: moderateScale(14),
    minHeight: verticalScale(48),
    borderWidth: 1,
    borderColor: '#302A29',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: scaleFont(18),
    marginLeft: moderateScale(8),
    paddingVertical: verticalScale(8),
  },
  title: {
    color: '#FFFFFF',
    fontSize: scaleFont(24),
    fontWeight: '800',
  },
  searchButton: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    borderWidth: 1,
    borderColor: '#5B5B5B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
  },
  tabsWrap: {
    backgroundColor: '#1A1615', 
    borderRadius: moderateScale(30),
    padding: moderateScale(4),
    flexDirection: 'row',
    marginBottom: verticalScale(18),
  },
  tabButton: {
    flex: 1,
    borderRadius: moderateScale(25),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#0F0A09',
  },
  tabText: {
    color: '#8E8A89',
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: verticalScale(16),
  },
  searchLoader: {
    marginTop: verticalScale(10),
  },
  emptyText: {
    color: '#8E8A89',
    fontSize: scaleFont(15),
    marginTop: verticalScale(16),
  },
  errorText: {
    color: '#FF7D7D',
    fontSize: scaleFont(15),
    marginTop: verticalScale(10),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(16),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    marginRight: moderateScale(12),
    backgroundColor: '#383838',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: scaleFont(16),
    fontWeight: '700',
    flexShrink: 1,
  },
  darkActionButton: {
    backgroundColor: '#1E1B1A',
    borderRadius: moderateScale(18),
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(9),
    marginLeft: moderateScale(12),
  },
  darkActionText: {
    color: '#FFFFFF',
    fontSize: scaleFont(15),
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: moderateScale(10),
  },
  yellowButton: {
    backgroundColor: '#F8C819',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(8),
    marginRight: moderateScale(8),
  },
  yellowButtonText: {
    color: '#111111',
    fontSize: scaleFont(16),
    fontWeight: '700',
  },
  iconActionButton: {
    padding: moderateScale(4),
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: scaleFont(24),
    fontWeight: '800',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(6),
  },
  smallYellowButton: {
    backgroundColor: '#F8C819',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    marginLeft: moderateScale(12),
  },
  smallYellowButtonText: {
    color: '#111111',
    fontSize: scaleFont(16),
    fontWeight: '700',
  },
  separator: {
    height: verticalScale(1),
    backgroundColor: '#211C1A',
  },
});

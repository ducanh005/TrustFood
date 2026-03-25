import { API_ENDPOINTS } from '../config/api';
import { apiRequest } from './httpClient';

export type FriendSearchItem = {
  id: string;
  name: string;
  avatar: string;
};

type SearchFriendResponse = {
  items?: FriendSearchItem[];
};

export async function searchFriendsApi(query: string, signal?: AbortSignal): Promise<FriendSearchItem[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const payload = await apiRequest<SearchFriendResponse>(
    `${API_ENDPOINTS.friendSearch}?q=${encodeURIComponent(trimmed)}`,
    { signal },
  );

  return payload.items ?? [];
}

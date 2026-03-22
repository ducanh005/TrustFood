export type FriendSearchItem = {
  id: string;
  name: string;
  avatar: string;
};

type RandomUserResponse = {
  results?: Array<{
    login?: { uuid?: string };
    name?: { first?: string; last?: string };
    picture?: { large?: string; medium?: string; thumbnail?: string };
  }>;
};

export async function searchFriendsApi(query: string, signal?: AbortSignal): Promise<FriendSearchItem[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const endpoint = `https://randomuser.me/api/?results=15&inc=login,name,picture&seed=trustfood-${encodeURIComponent(trimmed)}`;
  const response = await fetch(endpoint, { signal });

  if (!response.ok) {
    throw new Error(`Search API failed with status ${response.status}`);
  }

  const payload = (await response.json()) as RandomUserResponse;
  const keyword = trimmed.toLowerCase();

  return (payload.results ?? [])
    .map((item, index) => {
      const first = item.name?.first?.trim() ?? '';
      const last = item.name?.last?.trim() ?? '';
      const name = `${first} ${last}`.trim();
      const avatar = item.picture?.large ?? item.picture?.medium ?? item.picture?.thumbnail ?? '';
      const id = item.login?.uuid ?? `api-${trimmed}-${index}`;

      return {
        id,
        name,
        avatar,
      };
    })
    .filter((item) => item.name && item.name.toLowerCase().includes(keyword));
}

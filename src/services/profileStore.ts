type ProfileData = {
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
};

export type UpdateProfilePayload = Partial<Pick<ProfileData, 'name' | 'email' | 'bio'>>;

const profileData: ProfileData = {
  name: 'Gazel Stornof',
  username: 'tepcon86',
  email: 'gazelstornof99@gmail.com',
  avatar: 'https://i.pravatar.cc/150?img=3',
  bio: 'Tôi là 1 cậu nhóc thích ăn uống và luôn muốn trải nghiệm khám phá',
};

export function getProfileData(): ProfileData {
  return { ...profileData };
}

export function updateProfileBio(nextBio: string): void {
  profileData.bio = nextBio;
}

export function updateProfileData(payload: UpdateProfilePayload): ProfileData {
  if (payload.name !== undefined) {
    profileData.name = payload.name;
  }

  if (payload.email !== undefined) {
    profileData.email = payload.email;
  }

  if (payload.bio !== undefined) {
    profileData.bio = payload.bio;
  }

  return { ...profileData };
}

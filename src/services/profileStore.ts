type ProfileData = {
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
};

const profileData: ProfileData = {
  name: 'Gazel Stornof',
  username: 'tepcon86',
  email: 'gazelstornof99@gmail.com',
  avatar: 'https://i.pravatar.cc/150?img=3',
  bio: 'Tôi là 1 cậu nhóc thích ăn uống và luôn muốn trải nghiệm khám phá',
};

export function getProfileData(): ProfileData {
  return profileData;
}

export function updateProfileBio(nextBio: string): void {
  profileData.bio = nextBio;
}

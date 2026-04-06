
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { getProfileData } from '../../services/profileStore';
import { useAuth } from '../../context/AuthContext';
import { moderateScale, scaleFont, verticalScale } from '../../utils/responsive';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type MenuAction = 'terms' | 'helpCenter' | 'shareApp' | 'changePassword';

type MenuItem = {
	id: string;
	icon: IconName;
	title: string;
	desc: string;
	action: MenuAction;
};

const user = getProfileData();

const settingItems: MenuItem[] = [
	{
		id: 'terms',
		icon: 'help-circle-outline',
		title: 'Điều khoản sử dụng',
		desc: 'Tìm hiểu cách ứng dụng hoạt động',
		action: 'terms' as const,
	},
	{
		id: 'help-center',
		icon: 'headset-outline',
		title: 'Trung tâm trợ giúp',
		desc: 'Hỗ trợ bạn trong quá trình dùng ứng dụng',
		action: 'helpCenter' as const,
	},
	{
		id: 'share-app',
		icon: 'share-social-outline',
		title: 'Chia sẻ ứng dụng',
		desc: 'Mời bạn bè tham gia ứng dụng',
		action: 'shareApp' as const,
	},
	{
		id: 'change-password',
		icon: 'lock-closed-outline',
		title: 'Đổi mật khẩu',
		desc: 'Đổi thông tin mật khẩu của bạn',
		action: 'changePassword' as const,
	},
];

export default function ProfileScreen() {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { logout } = useAuth();
	const [bio, setBio] = useState(user.bio);

	useFocusEffect(
		useCallback(() => {
			setBio(getProfileData().bio);
		}, []),
	);

	const handleBack = useCallback(() => {
		if (navigation.canGoBack()) {
			navigation.goBack();
			return;
		}
		navigation.navigate('Discover');
	}, [navigation]);

	const openPersonalInfo = useCallback(() => {
		navigation.navigate('PersonalInfo');
	}, [navigation]);

	const openProfileReviews = useCallback(() => {
		navigation.navigate('ProfileReviews');
	}, [navigation]);

	const goSplash = useCallback(() => {
		void logout();
	}, [logout]);

	const handleMenuPress = useCallback(
		(action: MenuAction) => {
			if (action === 'terms') {
				navigation.navigate('TermsOfUse');
				return;
			}

			if (action === 'helpCenter') {
				navigation.navigate('HelpCenter');
				return;
			}

			if (action === 'shareApp') {
				navigation.navigate('ShareApp');
				return;
			}

			navigation.navigate('ChangePassword');
		},
		[navigation],
	);

	return (
		<View style={styles.container}>
			<ScrollView
				style={styles.contentScroll}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
						<Ionicons name="arrow-back-outline" size={moderateScale(28)} color="#fff" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Cá nhân</Text>
				</View>

				{/* User Info */}
				<View style={styles.userInfo}>
					<TouchableOpacity style={styles.userProfileArea} activeOpacity={0.8} onPress={openProfileReviews}>
						<Image source={{uri: user.avatar}} style={styles.avatar} />
						<View style={styles.userTextWrap}>
							<Text style={styles.name}>{user.name}</Text>
							<Text style={styles.username}>{user.username}</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.editBioBtn}
						activeOpacity={0.8}
						onPress={openPersonalInfo}
					>
						<Ionicons name="pencil-outline" size={moderateScale(18)} color="#181210" />
					</TouchableOpacity>
				</View>
				<Text style={styles.bioText} numberOfLines={2} ellipsizeMode="tail">
					{bio}
				</Text>

				{/* App Settings Section */}
				<Text style={styles.sectionLabel}>APP CÀI ĐẶT</Text>
				<View style={styles.sectionBox}>
					{settingItems.map((item) => (
						<TouchableOpacity
							key={item.id}
							style={styles.menuItem}
							activeOpacity={0.7}
							onPress={() => handleMenuPress(item.action)}
						>
							<View style={styles.iconBox}>
								<Ionicons name={item.icon} size={moderateScale(24)} color="#FFD600" />
							</View>
							<View style={styles.menuTextWrap}>
								<Text style={styles.menuTitle}>{item.title}</Text>
								<Text style={styles.menuDesc}>{item.desc}</Text>
							</View>
							<Ionicons name="chevron-forward" size={moderateScale(22)} color="#888" />
						</TouchableOpacity>
					))}
				</View>

				{/* TODO(backend): Replace hardcoded profile/menu actions with API-driven user/account state. */}
				{/* TODO(backend): ProfileReviews screen is currently hardcoded; replace with API post list and profile stats. */}
			</ScrollView>

			<View style={styles.logoutWrap}>
				<TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={goSplash}>
					<Text style={styles.logoutText}>Đăng Xuất</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#181210',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: verticalScale(36),
		paddingBottom: verticalScale(12),
		paddingHorizontal: moderateScale(16),
		backgroundColor: 'transparent',
	},
	backBtn: {
		width: moderateScale(36),
		height: moderateScale(36),
		borderRadius: moderateScale(18),
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: moderateScale(8),
	},
	headerTitle: {
		color: '#fff',
		fontSize: scaleFont(22),
		fontWeight: 'bold',
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: moderateScale(16),
		paddingVertical: verticalScale(18),
	},
	userProfileArea: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: moderateScale(60),
		height: moderateScale(60),
		borderRadius: moderateScale(30),
		backgroundColor: '#888',
	},
	editBioBtn: {
		width: moderateScale(34),
		height: moderateScale(34),
		borderRadius: moderateScale(17),
		backgroundColor: '#FFD600',
		justifyContent: 'center',
		alignItems: 'center',
	},
	name: {
		color: '#fff',
		fontSize: scaleFont(18),
		fontWeight: 'bold',
	},
	username: {
		color: '#aaa',
		fontSize: scaleFont(15),
		marginTop: verticalScale(2),
	},
	bioText: {
		color: '#8f8f8f',
		fontSize: scaleFont(14),
		lineHeight: verticalScale(20),
		paddingHorizontal: moderateScale(16),
		marginTop: -verticalScale(6),
		marginBottom: verticalScale(8),
	},
	sectionLabel: {
		color: '#aaa',
		fontSize: scaleFont(13),
		fontWeight: 'bold',
		marginTop: verticalScale(18),
		marginBottom: verticalScale(4),
		marginLeft: moderateScale(16),
		letterSpacing: 1,
	},
	sectionBox: {
		backgroundColor: '#1c1613',
		borderRadius: moderateScale(12),
		marginHorizontal: moderateScale(12),
		marginBottom: verticalScale(8),
		paddingVertical: verticalScale(2),
		overflow: 'hidden',
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: verticalScale(14),
		paddingHorizontal: moderateScale(12),
		borderBottomWidth: 1,
		borderBottomColor: '#231a17',
	},
	iconBox: {
		width: moderateScale(38),
		height: moderateScale(38),
		borderRadius: moderateScale(19),
		backgroundColor: '#231a17',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: moderateScale(14),
	},
	menuTextWrap: {
		flex: 1,
	},
	userTextWrap: {
		marginLeft: moderateScale(16),
	},
	contentScroll: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: verticalScale(20),
	},
	logoutWrap: {
		paddingHorizontal: moderateScale(32),
		paddingTop: verticalScale(10),
		paddingBottom: verticalScale(24),
		backgroundColor: '#181210',
	},
	menuTitle: {
		color: '#fff',
		fontSize: scaleFont(16),
		fontWeight: 'bold',
	},
	menuDesc: {
		color: '#aaa',
		fontSize: scaleFont(13),
		marginTop: verticalScale(2),
	},
	logoutBtn: {
		backgroundColor: 'transparent',
		borderWidth: 1.5,
		borderColor: '#FF3B30',
		borderRadius: moderateScale(24),
		paddingVertical: verticalScale(12),
		alignItems: 'center',
	},
	logoutText: {
		color: '#FF3B30',
		fontSize: scaleFont(17),
		fontWeight: 'bold',
		letterSpacing: 1,
	},
});

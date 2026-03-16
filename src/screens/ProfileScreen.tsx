
import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Easing } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type MenuAction = 'personalInfo' | 'terms' | 'helpCenter' | 'shareApp' | 'changePassword';

type MenuItem = {
	id: string;
	icon: IconName;
	title: string;
	desc: string;
	action: MenuAction;
};

const user = {
	name: 'Gazel Stornof',
	username: 'tepcon86',
	avatar: 'https://i.pravatar.cc/150?img=3',
};

const menuItems: MenuItem[] = [
	{
		id: 'personal-info',
		icon: 'person-outline',
		title: 'Thông tin cá nhân',
		desc: 'Tên người dùng và email của bạn',
		action: 'personalInfo' as const,
	},
];

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
	const translateY = useRef(new Animated.Value(-120)).current;
	const opacity = useRef(new Animated.Value(0)).current;

	const handleBack = useCallback(() => {
		if (navigation.canGoBack()) {
			navigation.goBack();
			return;
		}
		navigation.navigate('Discover');
	}, [navigation]);

	useFocusEffect(
		useCallback(() => {
			translateY.setValue(-120);
			opacity.setValue(0);
			Animated.parallel([
				Animated.spring(translateY, {
					toValue: 0,
					friction: 9,
					tension: 68,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 1,
					duration: 280,
					easing: Easing.out(Easing.cubic),
					useNativeDriver: true,
				}),
			]).start();
		}, [opacity, translateY]),
	);

	const openPersonalInfo = useCallback(() => {
		navigation.navigate('PersonalInfo');
	}, [navigation]);

	const goSplash = useCallback(() => {
		navigation.reset({
			index: 0,
			routes: [{ name: 'Splash' }],
		});
	}, [navigation]);

	const handleMenuPress = useCallback(
		(action: MenuAction) => {
			if (action === 'personalInfo') {
				openPersonalInfo();
				return;
			}

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
		[navigation, openPersonalInfo],
	);

	return (
		<Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}> 
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
						<Ionicons name="arrow-back-outline" size={28} color="#fff" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Cá nhân</Text>
				</View>

				{/* User Info */}
				<TouchableOpacity style={styles.userInfo} activeOpacity={0.8} onPress={openPersonalInfo}>
					<Image source={{uri: user.avatar}} style={styles.avatar} />
					<View style={styles.userTextWrap}>
						<Text style={styles.name}>{user.name}</Text>
						<Text style={styles.username}>{user.username}</Text>
					</View>
				</TouchableOpacity>

				{/* Account Section */}
				<Text style={styles.sectionLabel}>TÀI KHOẢN</Text>
				<View style={styles.sectionBox}>
					{menuItems.map((item) => (
						<TouchableOpacity
							key={item.id}
							style={styles.menuItem}
							activeOpacity={0.7}
							onPress={() => handleMenuPress(item.action)}
						>
							<View style={styles.iconBox}>
								<Ionicons name={item.icon} size={24} color="#FFD600" />
							</View>
							<View style={styles.menuTextWrap}>
								<Text style={styles.menuTitle}>{item.title}</Text>
								<Text style={styles.menuDesc}>{item.desc}</Text>
							</View>
							<Ionicons name="chevron-forward" size={22} color="#888" />
						</TouchableOpacity>
					))}
				</View>

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
								<Ionicons name={item.icon} size={24} color="#FFD600" />
							</View>
							<View style={styles.menuTextWrap}>
								<Text style={styles.menuTitle}>{item.title}</Text>
								<Text style={styles.menuDesc}>{item.desc}</Text>
							</View>
							<Ionicons name="chevron-forward" size={22} color="#888" />
						</TouchableOpacity>
					))}
				</View>

				{/* Logout Button */}
				<TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={goSplash}>
					<Text style={styles.logoutText}>Đăng Xuất</Text>
				</TouchableOpacity>

				{/* TODO(backend): Replace hardcoded profile/menu actions with API-driven user/account state. */}
				{/* TODO(backend): Connect logout to auth API (revoke token/session) before navigating to Splash. */}
			</ScrollView>
		</Animated.View>
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
		paddingTop: 36,
		paddingBottom: 12,
		paddingHorizontal: 16,
		backgroundColor: 'transparent',
	},
	backBtn: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8,
	},
	headerTitle: {
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 18,
	},
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#888',
	},
	name: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
	username: {
		color: '#aaa',
		fontSize: 15,
		marginTop: 2,
	},
	sectionLabel: {
		color: '#aaa',
		fontSize: 13,
		fontWeight: 'bold',
		marginTop: 18,
		marginBottom: 4,
		marginLeft: 16,
		letterSpacing: 1,
	},
	sectionBox: {
		backgroundColor: '#1c1613',
		borderRadius: 12,
		marginHorizontal: 12,
		marginBottom: 8,
		paddingVertical: 2,
		overflow: 'hidden',
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 14,
		paddingHorizontal: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#231a17',
	},
	iconBox: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: '#231a17',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 14,
	},
	menuTextWrap: {
		flex: 1,
	},
	userTextWrap: {
		marginLeft: 16,
	},
	scrollContent: {
		paddingBottom: 32,
	},
	menuTitle: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	menuDesc: {
		color: '#aaa',
		fontSize: 13,
		marginTop: 2,
	},
	logoutBtn: {
		marginTop: 28,
		marginHorizontal: 32,
		backgroundColor: 'transparent',
		borderWidth: 1.5,
		borderColor: '#FF3B30',
		borderRadius: 24,
		paddingVertical: 12,
		alignItems: 'center',
	},
	logoutText: {
		color: '#FF3B30',
		fontSize: 17,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
});

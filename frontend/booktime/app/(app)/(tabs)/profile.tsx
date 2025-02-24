import { ProfileMenu } from '@/components/profile/ProfileMenu';
import { useUser } from '@/hooks/useUser';
import styles, { headerMaxHeight, headerMinHeight, profileImageMaxSize } from '@/styles/profile';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset, interpolateColor } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, IconButton, useTheme } from 'react-native-paper';

const bannerImage = require('@/assets/images/banner.jpg');

export const headerPageText = "Embark on a journey of transformation with our innovative app designed to enhance every aspect of your life. Whether you're seeking to boost productivity, ignite creativity, or simply streamline daily tasks, our platform empowers you to reach new heights.";

const ProfileTab = () => {
    const { colors } = useTheme();
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const user = useUser();

    const handlePresentModalPress = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const insets = useSafeAreaInsets();
    const verticalPadding = 20;
    const headerReelMinHeight = insets.top + headerMinHeight;
    const inputRange = [0, headerMaxHeight - headerReelMinHeight];
    const profileImageMinSize = headerMinHeight - verticalPadding;


    // Style animé pour le header
    const headerAnimatedStyles = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            scrollOffset.value,
            inputRange,
            [styles.header.backgroundColor, colors.surfaceVariant],
        )
        const height = interpolate(
            scrollOffset.value,
            inputRange,
            [headerMaxHeight, headerReelMinHeight],
            Extrapolation.CLAMP
        );
        return { height, backgroundColor };
    });

    // Style animé pour le container du profil
    const innerHeaderAnimatedStyles = useAnimatedStyle(() => {
        const paddingBottom = interpolate(
            scrollOffset.value,
            inputRange,
            [20, verticalPadding / 2],
            Extrapolation.CLAMP
        )
        return {
            paddingBottom,
        };
    });

    // Style animé pour l'image de profil
    const profileImageAnimatedStyles = useAnimatedStyle(() => {
        const size = interpolate(
            scrollOffset.value,
            inputRange,
            [profileImageMaxSize, profileImageMinSize],
            Extrapolation.CLAMP
        );
        return {
            width: size,
            height: size,
        };
    });

    // Style animé pour le nom d'utilisateur
    const profileNameAnimatedStyles = useAnimatedStyle(() => {
        const fontSize = interpolate(
            scrollOffset.value,
            inputRange,
            [20, 16],
            Extrapolation.CLAMP
        );
        const translateY = interpolate(
            scrollOffset.value,
            inputRange,
            [0, (-profileImageMinSize + fontSize) / 2],
            Extrapolation.CLAMP
        )
        const bottom = interpolate(
            scrollOffset.value,
            inputRange,
            [0, profileImageMinSize / 2]
        )
        return {
            fontSize,
            transform: [{ translateY }]
            // bottom,
        };
    });

    // Style animé pour la bannière avec effet de scale
    const bannerImageAnimatedStyles = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollOffset.value,
            inputRange,
            [1.4, 1],
            { extrapolateRight: Extrapolation.CLAMP },
        );

        const opacity = interpolate(
            scrollOffset.value,
            inputRange,
            [0.5, 0],
            { extrapolateRight: Extrapolation.CLAMP },
        );
        return { transform: [{ scale }], opacity };
    });

    return (
        <SafeAreaView>
            <ProfileMenu ref={bottomSheetRef} />
            <Animated.View style={[styles.header, headerAnimatedStyles]}>
                <Animated.Image source={bannerImage} style={[styles.bannerImage, bannerImageAnimatedStyles]} />
                <Animated.View style={[
                    styles.innerHeader,
                    innerHeaderAnimatedStyles,
                    { paddingTop: insets.top } // Add padding top to avoid the status bar overlap. Needed because of the absolute position of the header
                ]}>
                    <Animated.View style={[styles.profileImageContainer, profileImageAnimatedStyles]}>
                        {user && user.profil_image ? (
                            <Avatar.Image source={{ uri: user.profil_image }} style={styles.profileImage} />
                        ) : (
                            <Avatar.Icon icon="account" style={styles.profileImage} size={18} />
                        )}
                    </Animated.View>
                    <Animated.Text style={[styles.profileName, profileNameAnimatedStyles]}>
                        {user ? user.name || "Guest" : "User Name"}
                    </Animated.Text>
                </Animated.View>
                <SafeAreaView edges={['left', 'right']} style={[styles.menuContainer, { height: headerReelMinHeight }]}>
                    <IconButton icon="menu" onPress={handlePresentModalPress} mode='contained' />
                </SafeAreaView>
            </Animated.View>
            <Animated.ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.scrollContent}
                snapToOffsets={[headerMaxHeight - headerReelMinHeight]}
                snapToEnd={false}
                overScrollMode={"always"}
            >
                <View style={styles.innerContainer}>
                    <Text style={styles.description}>
                        {headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}
                    </Text>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

import { StickyParallaxHeader } from '@/components/profile/StickyParallaxHeader';
import AvatarParallaxHeader from '@/components/profile/AvatarParallaxHeader';

const ProfileTab2 = () => {
    return (
        <AvatarParallaxHeader
        // title='Profile'
        // image={
        //     <Avatar.Icon icon="account" size={32} />
        // }
        />
    );
}

export default ProfileTab;

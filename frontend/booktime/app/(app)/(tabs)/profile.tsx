import { ModalProfileCenter } from '@/components/profileCenter';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styles, { headerMaxHeight, headerMinHeight, profileImageMaxSize } from './profile.style';

const profileImage = require('@/assets/images/profil.png');
const bannerImage = require('@/assets/images/banner.jpg');

export const headerPageText = "Embark on a journey of transformation with our innovative app designed to enhance every aspect of your life. Whether you're seeking to boost productivity, ignite creativity, or simply streamline daily tasks, our platform empowers you to reach new heights.";

export default function Profile() {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

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
        const height = interpolate(
            scrollOffset.value,
            inputRange,
            [headerMaxHeight, headerReelMinHeight],
            Extrapolation.CLAMP
        );
        return { height };
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

    // TODO: Ca marche mais c pas fluide, a refaire
    const handleScrollEndDrag = () => {
        if (scrollOffset.value < headerMaxHeight - headerReelMinHeight) {
            if (scrollOffset.value > (headerMaxHeight - headerReelMinHeight) / 2) {
                scrollRef.current?.scrollTo({ y: headerMaxHeight - headerReelMinHeight, animated: true });
            }
            else {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <ModalProfileCenter ref={bottomSheetRef} />
            <Animated.View style={[styles.header, headerAnimatedStyles]}>
                <Animated.Image source={bannerImage} style={[styles.bannerImage, bannerImageAnimatedStyles]} />
                <Animated.View style={[
                    styles.innerHeader,
                    innerHeaderAnimatedStyles,
                    { paddingTop: insets.top } // Add padding top to avoid the status bar overlap. Needed because of the absolute position of the header
                ]}>
                    <Animated.Image source={profileImage} style={[styles.profileImage, profileImageAnimatedStyles]} />
                    <Animated.Text style={[styles.profileName, profileNameAnimatedStyles]}>
                        Nom d'utilisateur
                    </Animated.Text>
                </Animated.View>
                <View style={[
                    styles.menuContainer,
                    {
                        paddingTop: insets.top,
                        height: headerReelMinHeight
                    }
                ]}>
                    <TouchableOpacity style={styles.menuButton} onPress={handlePresentModalPress}>
                        <Ionicons name="menu" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <Animated.ScrollView ref={scrollRef} onScrollEndDrag={handleScrollEndDrag} contentContainerStyle={styles.scrollContent}>
                <View style={styles.innerContainer}>
                    <Text style={styles.description}>
                        {headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}
                    </Text>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}


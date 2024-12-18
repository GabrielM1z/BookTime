import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalProfileList } from '@/components/ModalProfileList';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const profileImage = require('@/assets/images/profil.png');
const bannerImage = require('@/assets/images/banner.jpg');

const profileImageMaxSize = 100; // Taille maximale de la photo de profil
export const { height: sHeight, width: sWidth } = Dimensions.get('screen');
const ImageHeight = 280; // Hauteur initiale de l'image
const Colors = {
    darkGray: '#22313a',
    gray: '#3b6978',
    orange: '#f9a03f',
    black: '#000',
};

const headerHeight = 60;

export const headerPageText = "Embark on a journey of transformation with our innovative app designed to enhance every aspect of your life. Whether you're seeking to boost productivity, ignite creativity, or simply streamline daily tasks, our platform empowers you to reach new heights.";

export default function Profil() {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const insets = useSafeAreaInsets();
    const verticalPadding = 20;
    const headerMinHeight = insets.top + headerHeight;
    const inputRange = [0, ImageHeight - headerMinHeight];
    const profileImageMinSize = headerHeight - verticalPadding;


    // Style animé pour le header
    const headerAnimatedStyles = useAnimatedStyle(() => {
        const height = interpolate(
            scrollOffset.value,
            inputRange,
            [ImageHeight, headerMinHeight],
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
        if (scrollOffset.value < ImageHeight - headerMinHeight) {
            if (scrollOffset.value > (ImageHeight - headerMinHeight) / 2) {
                scrollRef.current?.scrollTo({ y: ImageHeight - headerMinHeight, animated: true });
            }
            else {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <ModalProfileList ref={bottomSheetRef} />
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
                        height: headerMinHeight
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    header: {
        position: 'absolute', // Need by banner image to be on top
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.darkGray,
        overflow: 'hidden',
        zIndex: 10,
    },
    innerHeader: {
        flex: 1,
        paddingHorizontal: 20,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    menuContainer: {
        position: 'absolute',
        right: 20,
        justifyContent: 'center',
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.gray + '30',
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerImage: {
        width: '100%',
        height: ImageHeight,
        position: 'absolute',
        top: 0,
    },
    profileImage: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 50,
    },
    profileName: {
        position: 'relative',
        marginLeft: 10,
        color: Colors.orange,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingTop: ImageHeight,
    },
    innerContainer: {
        margin: 20,
    },
    description: {
        color: 'white',
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'justify',
    },
});

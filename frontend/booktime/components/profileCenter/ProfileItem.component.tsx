import { User } from "@/models/User";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import TouchableScale from "../TouchableScale";
import AntDesign from '@expo/vector-icons/AntDesign';

const profileImage = require('@/assets/images/profil.png');

export interface ProfileItemProps {
    item: User;
    isSelected: boolean;
    onItemClicked?: (id: string) => void;
    onMenuClicked?: () => void;
};

export const ProfileItem = (props: ProfileItemProps) => {
    const user: User = { name: 'Guest', email: '', pseudo: 'guest', ...props.item };
    const renderProfileImage = () => {
        if (user.profil_image) {
            return <Image source={profileImage} style={styles.profileImage} />;
        }
        return <AntDesign name="user" color="black" style={styles.profileImage} size={50} />
    }
    return (
        <View style={styles.profileItem}>
            <TouchableScale
                style={[styles.profileItemTouchable, { backgroundColor: props.isSelected ? '#E0E0E0' : '#F5F5F5' }]}
                onPress={() => props.onItemClicked && props.onItemClicked(props.item.id_user)}
                scaleTo={0.98}
                duration={100}
            >
                {renderProfileImage()}
                <View style={styles.profileTextContainer}>
                    <Text style={styles.profileName}>{user.name}</Text>
                </View>
            </TouchableScale>
            {props.isSelected && (
                <TouchableScale onPress={props.onMenuClicked}>
                    <Entypo name="dots-three-horizontal" size={24} color="#007AFF" />
                </TouchableScale>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    profileItemTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        flex: 1,
        marginRight: 12,
    },
    profileImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    profileTextContainer: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    dotsButton: {
        marginLeft: 8,
    },
});

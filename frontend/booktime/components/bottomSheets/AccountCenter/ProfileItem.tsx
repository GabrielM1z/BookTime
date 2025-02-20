import React from "react";
import { Image, Text, View } from "react-native";
import TouchableScale from "@/components/TouchableScale";
import AntDesign from '@expo/vector-icons/AntDesign';
import { styles } from "./styles";
import { Avatar, AvatarImageProps } from "react-native-paper";


export interface ProfileItemProps {
    id: string;
    image?: string;
    text: string;
    isSelected: boolean;
    onItemClicked?: (id: string) => void;
};


export const ProfileItem = (props: ProfileItemProps) => {
    return (
        <View style={styles.profileItem}>
            <TouchableScale
                style={styles.profileItemTouchable}
                onPress={() => props.onItemClicked && !props.isSelected && props.onItemClicked(props.id)}
                scaleTo={0.98}
                duration={100}
            >
                <View style={styles.profileImageContainer}>
                    {props.image ?
                        <Avatar.Image size={50} source={{ uri: props.image }} /> :
                        <Avatar.Icon size={50} icon="account" />}
                </View>
                <View style={styles.profileTextContainer}>
                    <Text style={styles.profileText}>{props.text}</Text>
                </View>
            </TouchableScale>
            {props.isSelected && (
                <AntDesign name="checkcircle" size={24} color="blue" />
            )}
        </View>
    );
};

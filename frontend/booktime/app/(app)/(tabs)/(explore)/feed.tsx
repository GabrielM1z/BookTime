import { SafeAreaView, FlatList, View, StyleSheet, Image, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Text, Card, Paragraph, Title } from "react-native-paper";
import { api } from "@/services/axios";
import { useTheme } from 'react-native-paper';

const FeedTab = () => {

    const { colors } = useTheme();

    const [newsData, setNewsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const stylesThemed = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
        },
        newsItem: {
            backgroundColor: colors.onPrimaryContainer,
        },
        newsTitle: {
            color: colors.onPrimary,
        },
        newsDescription: {
            color: colors.onPrimary,
        },
        newsSource: {
            color: colors.onPrimary,
        },
        loadingText: {
            color: colors.onPrimaryContainer,
        },
        loader: {
            color: colors.onPrimaryContainer,
        }
    });

    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                const response = await api.get(`/news/search?language=fr`);
                setNewsData(response.data);
            } catch (error) {
                console.error("Error fetching news data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsData();
    }, []);

    const renderNewsItem = ({ item }) => (
        <TouchableOpacity style={[styles.newsItem, stylesThemed.newsItem]} onPress={() => Linking.openURL(item.url)}>
            <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
            <View style={styles.newsContent}>
                <Title style={[styles.newsTitle, stylesThemed.newsTitle]} numberOfLines={2}>{item.title}</Title>
                <Paragraph style={[styles.newsDescription, stylesThemed.newsDescription]} numberOfLines={3}>{item.description}</Paragraph>
                <Text style={[styles.newsSource, stylesThemed.newsSource]}>{item.source.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, stylesThemed.container]}>
            {loading ? (
                <View style={[styles.loadingContainer, stylesThemed.container]}>
                    <ActivityIndicator color={stylesThemed.loader.color} animating={true} size="large" />
                    <Text style={[styles.loadingText, stylesThemed.loadingText]}>Chargement des nouvelles...</Text>
                </View>
            ) : (
                <FlatList
                    data={newsData}
                    renderItem={renderNewsItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.newsList}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    newsList: {
        paddingBottom: 20,
    },
    newsItem: {
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2,
    },
    newsImage: {
        width: 100,
        height: 100,
    },
    newsContent: {
        flex: 1,
        padding: 10,
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    newsDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    newsSource: {
        fontSize: 12,
        color: '#999',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#777',
    },
});

export default FeedTab;

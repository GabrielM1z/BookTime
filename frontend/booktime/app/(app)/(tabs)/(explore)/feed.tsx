import { SafeAreaView, FlatList, View, StyleSheet, Image, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Text, Card, Paragraph, Title } from "react-native-paper";
import { api } from "@/services/axios";

const FeedTab = () => {
    const [newsData, setNewsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                const response = await api.get(`/news/search?topic=livre&language=fr`);
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
        <TouchableOpacity style={styles.newsItem} onPress={() => Linking.openURL(item.url)}>
            <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
            <View style={styles.newsContent}>
                <Title style={styles.newsTitle} numberOfLines={2}>{item.title}</Title>
                <Paragraph style={styles.newsDescription} numberOfLines={3}>{item.description}</Paragraph>
                <Text style={styles.newsSource}>{item.source.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} color="#0000ff" size="large" />
                    <Text style={styles.loadingText}>Chargement des nouvelles...</Text>
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

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Dimensions, TouchableOpacity, Linking } from 'react-native';

interface Article {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    source: {
        name: string;
    };
}

const News: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(
                    'https://newsapi.org/v2/everything?q=typescript&apiKey=65616e2ee13a4347a94031872e9aba7b'
                );
                const data = await response.json();
                setArticles(data.articles.slice(0, 10)); // Limit to 10 articles
            } catch (error) {
                console.error('Error fetching the news:', error);
            }
        };

        fetchNews();
    }, []);

    const renderItem = ({ item }: { item: Article }) => (
       
        <TouchableOpacity
            style={styles.card}
            onPress={() => Linking.openURL(item.url)}
            activeOpacity={0.8}
        >
            {item.urlToImage && (
                <Image source={{ uri: item.urlToImage }} style={styles.image} />
            )}
            <View style={styles.textContainer}>
                <Text style={styles.category}>{item.source.name.toUpperCase()}</Text>
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={articles}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Black background
        padding: 8,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#000', // Black background for cards
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: Dimensions.get('window').width * 0.3, // 30% of screen width
        height: 90,
    },
    textContainer: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
    },
    category: {
        fontSize: 12,
        color: '#bb9e9e', // Text color
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#bb9e9e', // Text color
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#bb9e9e', // Text color
    },
});

export default News;

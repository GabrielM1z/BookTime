import { StyleSheet, View, FlatList } from 'react-native';

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { router, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Book, BookInfosServeur } from '@/models/Book';
import { State } from '@/models/State';
import { useBookContext } from '@/contexts/BookContext';
import { Avatar, Button, IconButton, Text, TextInput, Title } from 'react-native-paper'
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import { useRepository } from '@/hooks/useRepository';
import { Author } from '@/models';

const IMG_HEIGHT = 300;


export default function LivreDetail() {

    const { bookController } = useBookContext();
    const { idBook, mode } = useLocalSearchParams();
    // const [book, setBook] = useState<Book>();
    const { data: book } = useRepository<Book | BookInfosServeur>(async () => await bookController.getBookById(idBook, mode));
    // const { data: listAuthors, refresh, loading } = useRepository<Author[]>(async () => (await bookController.author.getFromIdBooks(idBook)), []);
    const { data: listAuthors, refresh, loading } = useRepository<Author[]>(async () => {
        console.log("mode :", mode);

        if (mode == "search") {
            return book.authors;
        } else {
            return await bookController.author.getFromIdBooks(idBook)
        }
    }, [], [book]);
    const { data: bookState, refresh: refreshBookState } = useRepository<State | null>(async () => (await bookController.state.getFromIdBook(idBook)), null);

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
                    )
                },
                {
                    scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1])
                }
            ]
        };
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1])
        };
    });

    const { colors } = useTheme();
    const headerStyle = useMemo(() => [styles.header, {
        backgroundColor: colors.background
    }], [colors]);


    const headerTitle = useCallback(() => {
        return (
            <Animated.View style={[headerAnimatedStyle, styles.headerTitles]}><Text variant='titleMedium'>{book ? book.title : ""}</Text></Animated.View>
        )
    }, [book])

    const router = useRouter();

    const headerButton = () => {
        return (

            <Button icon="chevron-left" mode="contained" onPress={() => router.back()} children={undefined} />
        )
    }

    return (
        <View >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerLeft: headerButton,
                    headerBackground: () => <Animated.View style={[headerStyle, styles.header, headerAnimatedStyle]} />,
                    headerTitle: headerTitle,

                }}
            />
            <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
                <Animated.Image
                    source={{
                        uri: book?.cover_image_url
                    }}
                    style={[styles.image, imageAnimatedStyle]}
                />

                <View style={[{ height: 2000, backgroundColor: colors.background }]}>
                    {bookState ? <LivreDetailOwned bookState={bookState} book={book} /> : null}
                    <View style={styles.container}>

                        <Text variant='titleLarge'>
                            Auteurs :
                        </Text>
                        <FlatList
                            horizontal
                            nestedScrollEnabled
                            // style={styles.flatList}
                            data={listAuthors}
                            keyExtractor={(item) => item.id_author.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.authorElement}>
                                    <Avatar.Image size={100} source={require('@/assets/images/auteur.jpg')} />
                                    <Text variant='labelMedium' numberOfLines={1}>{item.name}</Text>
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                            onRefresh={refresh}
                            refreshing={loading}
                        />
                    </View>

                    <View style={styles.container}>
                        <Text variant='titleLarge'>
                            Description :
                        </Text>
                        <Text> {book?.description} </Text>
                    </View>

                </View>
            </Animated.ScrollView>
        </View>
    );
};

export interface LivreDetailOwnedProps {
    bookState: State;
    book: Book;
}

export function LivreDetailOwned({ bookState, book }: LivreDetailOwnedProps) {
    const { bookController } = useBookContext();
    const [progression, setProgression] = useState(bookState?.progression || 0);

    // Gestion du changement de valeur via TextInput
    const handleProgressChange = (text: string) => {
        let value = parseInt(text, 10); // Convertir en nombre entier
        if (!isNaN(value) && value >= 0 && value <= book.page_number) {
            setProgression(value);
        } else if (text === "") {
            setProgression(0); // Remet à zéro si l'utilisateur efface
        }
    };

    const handleConfirmProgressChange = async () => {
        bookState.progression = progression;
        bookState.last_read_date = (new Date()).getTime();

        await bookController.state.updateState(bookState);
    }
    return (
        <View style={styles.container}>
            <Text variant='titleLarge'>
                Progression :
            </Text>
            <View style={{ flexDirection: "row" }}>
                <TextInput
                    style={styles.inputNumber}
                    keyboardType="numeric"
                    placeholder="Page actuelle"
                    value={progression.toString()} // Convertir en string pour l'affichage
                    onChangeText={handleProgressChange} // Synchronise avec l'état
                    onBlur={handleConfirmProgressChange}
                />
                <Text variant='titleLarge' style={{ marginTop: "auto", marginBottom: "auto" }}>
                    / {book?.page_number}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    image: {
        marginTop: 10,
        height: IMG_HEIGHT,
        resizeMode: "contain"
    },
    header: {
        height: 100,
        borderWidth: StyleSheet.hairlineWidth,

    },
    headerTitles: {
        marginLeft: 20
    },
    authorElement: {
        width: 110,
    },
    container: {
        margin: 20,
    },
    slider: {
        width: 300,
        height: 40,
    },
    inputNumber: {
        width: 80,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 16,
    },
});

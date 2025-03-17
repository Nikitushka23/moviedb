import { FC } from 'react';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moviesApi } from '@/api/moviesApi';
import { Link } from 'expo-router';

interface TMovieItem {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export const MovieItem: FC<{
  item: TMovieItem;
  isFavorite: boolean;
  addToFav: (item: any, isFavorite: boolean) => Promise<void>;
}> = ({ item, isFavorite = false, addToFav }) => {
  return (
    <Link href={{ pathname: '/details', params: { id: item.id } }} asChild>
      <TouchableOpacity>
        <ThemedView style={{ flexDirection: 'row', backgroundColor: '#ddd', borderRadius: 8 }}>
          <Image
            style={{ width: 124, height: 124, borderRadius: 8 }}
            source={{ uri: `https://image.tmdb.org/t/p/w200/${item.poster_path}` }}
          />
          <View style={{ flex: 1, paddingHorizontal: 6, justifyContent: 'space-between' }}>
            <View>
              <ThemedText numberOfLines={1} style={{ fontWeight: '500' }}>
                {item.title} {item.release_date && `(${item.release_date.slice(0, 4)})`}
              </ThemedText>
              <ThemedText
                numberOfLines={4}
                style={{ fontSize: 12, letterSpacing: -0.1, lineHeight: 15 }}>
                {item.overview}
              </ThemedText>
            </View>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                addToFav(item, isFavorite);
              }}>
              <ThemedText style={{ color: isFavorite ? 'red' : 'green' }}>
                {isFavorite ? 'Remove from favs' : 'Add to favs'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
};

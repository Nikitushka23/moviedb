import { TextInput, View, Switch, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedFlatList } from '@/components/ThemedFlatList';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { MovieItem } from '@/components/MovieItem';

import { moviesApi } from '@/api/moviesApi';
import { authApi } from '@/api/authApi';
import { client } from '@/api/client';
import { Collapsible } from '@/components/Collapsible';

export default function HomeScreen() {
  const [movies, setMovies] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string; active?: boolean }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    initializeUser();
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovies();
    fetchFavorites();
  }, [genres]);

  const initializeUser = async () => {
    const sessionId = await AsyncStorage.getItem('session_id');
    if (sessionId) return;

    try {
      const {
        data: { request_token },
      } = await authApi.requestToken();
      const user = await authApi.createSessionWithLogin(
        request_token,
        process.env.EXPO_PUBLIC_TMDB_USERNAME,
        process.env.EXPO_PUBLIC_TMDB_PASSWORD,
      );
      const res = await client.post('3/authentication/session/new', {
        request_token: user.data.request_token,
      });
      await AsyncStorage.setItem('session_id', res.data.session_id);
    } catch (error) {
      console.error('User initialization error:', error);
    }
  };

  const fetchMovies = async () => {
    try {
      const activeGenreIds = genres.filter((g) => g.active).map((g) => g.id.toString());
      const res = await moviesApi.getList(activeGenreIds);
      setMovies(res.data.results);
    } catch (error) {
      console.error('Fetching movies error:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      if (!accountId) return;

      const res = await moviesApi.getFavorites(accountId);
      setFavorites(res.data.results);
    } catch (error) {
      console.error('Fetching favorites error:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await moviesApi.getGenres();
      setGenres(res.data.genres);
    } catch (error) {
      console.error('Fetching genres error:', error);
    }
  };

  const toggleFavorite = async (movie: any) => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      if (!accountId) return;

      const isFavorite = favorites.some((fav) => fav.id === movie.id);
      await moviesApi.addToFavorite(accountId, movie.id, !isFavorite);

      setFavorites((prevFavorites) =>
        isFavorite ? prevFavorites.filter((fav) => fav.id !== movie.id) : [...prevFavorites, movie],
      );
    } catch (error) {
      console.error('Toggling favorite error:', error);
    }
  };

  const toggleGenre = (genreId: number) => {
    setGenres((prevGenres) =>
      prevGenres.map((genre) =>
        genre.id === genreId ? { ...genre, active: !genre.active } : genre,
      ),
    );
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const displayedMovies = showFavoritesOnly ? favorites : filteredMovies;

  return (
    <ThemedSafeAreaView>
      <Collapsible title="filters">
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ padding: 8, backgroundColor: '#ddd', margin: 8, borderRadius: 8 }}
          placeholder="Search movie"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 8,
          }}>
          <ThemedText style={{ padding: 8, fontWeight: '500' }}>Show favorites only</ThemedText>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={showFavoritesOnly ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={() => setShowFavoritesOnly((prev) => !prev)}
            value={showFavoritesOnly}
          />
        </View>
        {!showFavoritesOnly && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8 }}>
            {genres.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={{
                  padding: 4,
                  backgroundColor: genre.active ? '#ddd' : undefined,
                  borderRadius: 8,
                  margin: 4,
                }}
                onPress={() => toggleGenre(genre.id)}>
                <ThemedText style={{ fontWeight: '500' }}>{genre.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Collapsible>
      <ThemedFlatList
        contentContainerStyle={{ padding: 8, paddingBottom: 200 }}
        data={displayedMovies}
        ItemSeparatorComponent={() => <ThemedView style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <MovieItem
            key={item.id}
            item={item}
            isFavorite={favorites.some((fav) => fav.id === item.id)}
            addToFav={toggleFavorite}
          />
        )}
      />
    </ThemedSafeAreaView>
  );
}

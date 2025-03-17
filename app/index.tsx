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
import { useAppSelector } from '@/store/store';
import { useDispatch } from 'react-redux';
import { getFavoritesList, getGenresList, getMovieList, moviesActions } from '@/store/moviesSlice';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { movies, favorites, genres } = useAppSelector((state) => state.moviesSlice);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [accountId, setAccountId] = useState(null as string);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (!accountId) return;
    dispatch(getGenresList());
    dispatch(
      getMovieList({ genres: genres.filter((genre) => genre.active).map((genre) => genre.id) }),
    );
    dispatch(getFavoritesList());
  }, [genres, accountId]);

  const initializeUser = async () => {
    const session_id = await AsyncStorage.getItem('session_id');
    if (session_id?.length) {
      const acc = await authApi.getAccount(session_id);
      await AsyncStorage.setItem('account_id', acc.data.id.toString());
      setAccountId(acc.data.id.toString());
      return;
    }

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
      console.log('res.data', res.data);
      await AsyncStorage.setItem('session_id', res.data.session_id);
      initializeUser();
    } catch (error) {
      console.error(error);
      alert(`cant get user:${error}`);
    }
  };

  const toggleFavorite = async (movie: any) => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      console.log('🚀 ~ toggleFavorite ~ accountId:', accountId);
      if (!accountId) return;

      const isFavorite = favorites.some((fav) => fav.id === movie.id);
      const res = await moviesApi.addToFavorite(accountId, movie.id, !isFavorite);
      console.log(res.data);
      if (!res.data.success) return;
      const newFavorites = isFavorite
        ? favorites.filter((fav) => fav.id !== movie.id)
        : [...favorites, movie];
      dispatch(moviesActions.setFavorites(newFavorites));
    } catch (error) {
      console.error('Toggling favorite error:', error);
    }
  };

  const toggleGenre = (genreId: number) => {
    const newGenres = genres.map((genre: any) =>
      genre.id === genreId ? { ...genre, active: !genre.active } : genre,
    );
    dispatch(moviesActions.setGenres(newGenres));
  };

  const filteredMovies = movies?.filter((movie) =>
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
            isFavorite={favorites?.some((fav) => fav.id === item.id)}
            addToFav={toggleFavorite}
          />
        )}
      />
    </ThemedSafeAreaView>
  );
}

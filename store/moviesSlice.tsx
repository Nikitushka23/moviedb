import { moviesApi } from '@/api/moviesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getMovieList = createAsyncThunk('movies/getMovieList', async ({ genres }) => {
  try {
    const res = await moviesApi.getList(genres);
    return res.data.results;
  } catch (error) {
    console.error('Fetching movies error:', error);
  }
});

export const getFavoritesList = createAsyncThunk('movies/getFavoritesList', async () => {
  try {
    const accountId = await AsyncStorage.getItem('account_id');
    if (!accountId) return;

    const res = await moviesApi.getFavorites(accountId);
    return res.data.results;
  } catch (error) {
    console.error('Fetching favorites error:', error);
  }
});

export const getGenresList = createAsyncThunk('movies/getGenresList', async () => {
  try {
    const res = await moviesApi.getGenres();
    return res.data.genres;
  } catch (error) {
    console.error('Fetching genres error:', error);
  }
});

const movies = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    favorites: [],
    genres: [],
    // searchQuery: '',
    // showFavoritesOnly: false,
  },
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    setGenres: (state, action) => {
      state.genres = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMovieList.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getFavoritesList.fulfilled, (state, action) => {
      state.favorites = action.payload;
    });
    builder.addCase(getGenresList.fulfilled, (state, action) => {
      state.genres = action.payload;
    });
  },
});

export const moviesActions = movies.actions;
export const moviesSlice = movies.reducer;

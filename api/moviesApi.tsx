import { client } from './client';

const getList = async (genre_ids?: string[]): Promise<any> =>
  await client.get(`/3/discover/movie?sort_by=title.asc&with_genres=${genre_ids?.join(',')}`);

const addToFavorite = async (
  account_id: string,
  movieId: number,
  favorite: boolean,
): Promise<any> =>
  await client.post(`/3/account/${account_id}/favorite`, {
    media_type: 'movie',
    media_id: movieId,
    favorite,
  });

const getFavorites = async (account_id: string): Promise<any> =>
  await client.get(`/3/account/${account_id}/favorite/movies`);

const getMovieDetails = async (movieId: string): Promise<any> =>
  await client.get(`/3/movie/${movieId}`);

const getGenres = async (): Promise<any> => await client.get('/3/genre/movie/list');

export const moviesApi = {
  getList,
  addToFavorite,
  getFavorites,
  getMovieDetails,
  getGenres,
};

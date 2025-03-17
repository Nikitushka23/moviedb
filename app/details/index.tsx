import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { moviesApi } from '@/api/moviesApi';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [details, setDetails] = useState<any>({});

  useEffect(() => {
    const getMovieDetails = async () => {
      const res = await moviesApi.getMovieDetails(id);
      setDetails(res.data);
    };
    getMovieDetails();
  }, [id]);

  if (!details?.id) return null;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500/${details.poster_path}` }}
          style={styles.reactLogo}
        />
      }>
      <ThemedText style={styles.title}>
        {details.title}{' '}
        <ThemedText style={[styles.title, { fontWeight: '400' }]}>
          ({details.release_date.slice(0, 4)})
        </ThemedText>
      </ThemedText>
      <ThemedText style={styles.tagline}>{details.tagline}</ThemedText>
      <ThemedText style={styles.description}>
        <ThemedText style={[styles.description, { fontWeight: '500' }]}>Genres: </ThemedText>
        {details.genres.map((genre) => genre.name).join(', ')}
      </ThemedText>
      <ThemedText style={styles.reviews}>Reviews: {details.vote_average} / 10</ThemedText>

      <ThemedText style={styles.description}>{details.overview}</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  title: {
    fontWeight: '500',
    fontSize: 24,
  },
  tagline: {
    fontWeight: '400',
    fontSize: 20,
  },
  description: {
    fontSize: 16,
  },
  reviews: {
    fontSize: 16,
    color: 'gray',
    fontWeight: '500',
  },
});

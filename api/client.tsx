import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://api.themoviedb.org/',
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`, but we're too lazy to do this
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOGNkZTk1YzU3YmQyNTVjMTE5MTcwZTJhOGYwMTQzNiIsIm5iZiI6MTc0MTg4NTE2Ni4zOTIsInN1YiI6IjY3ZDMwZWVlNjY4OTJiYWQ2MjgxYmM5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y32vs22n-luSEYBG1X525veOsJ_9mAYdeCcUAj__pKg`,
  },
});

import { client } from './client';

const requestToken = async () => client.get('/3/authentication/token/new');

const createSessionWithLogin = async (request_token: string, username: string, password: string) =>
  client.post('3/authentication/token/validate_with_login', {
    request_token,
    username,
    password,
  });

const getAccount = async (session_id: string) =>
  client.get(`https://api.themoviedb.org/3/account?session_id=${session_id}`);

export const authApi = {
  requestToken,
  createSessionWithLogin,
  getAccount,
};

import { LOCAL_STORAGE_API_TOKEN } from '../config/config';

const { error } = console;

interface Response {
  statusCode: string;
  results: string|[];
  error: string;
}

const handleResponse = (response: Response): string|[] => {
  if ('error' in response && response.error !== 'null' && response.error !== null) {
    throw new Error(response.error);
  }

  if ('results' in response) {
    return response.results;
  }

  throw new Error('No results. The response is maybe malformed.');
};

const getBearerToken = (): string => {
  const token = localStorage.getItem(LOCAL_STORAGE_API_TOKEN);

  return token ? `Bearer ${token}` : '';
};

const getHeaders = (): Record<string, string> => {
  const token = getBearerToken();

  if (token.trim().length > 0) {
    return { Authorization: getBearerToken() };
  }

  return {};
};

/**
 * Use this method to fetch Concerto API.
 * If you have to fetch an external API, see fetchExternalData().
 *
 * @param url
 */
export const fetchData = async (url: string): Promise<any> => {
  try {
    const headers = getHeaders();

    const request = await fetch(url, {
      method: 'GET',
      headers,
    });
    const response: Response = await request.json();

    return handleResponse(response);
  } catch (e) {
    error(`An error occurred while requesting ${url} : ${e}`);
    throw e;
  }
};

/**
 * Post data as a formData format.
 *
 * @param url
 * @param data
 */
export const postData = async (url: string, data: FormData): Promise<any> => {
  try {
    const headers = getHeaders();

    const request = await fetch(url, {
      method: 'POST',
      headers,
      body: data,
    });
    const response = await request.json();

    return handleResponse(response);
  } catch (e) {
    error(`An error occurred while sending data to ${url} : ${e}`);
    throw e;
  }
};

/**
 * Use this method to fetch external API data.
 * If you have to fetch Concerto Data, use FetchData().
 *
 * @param url
 */
export const fetchExternalData = async (url: string): Promise<any> => {
  try {
    const request = await fetch(url);
    return await request.json();
  } catch (e) {
    error(`An error occurred while requesting ${url} : ${e}`);
    throw e;
  }
};

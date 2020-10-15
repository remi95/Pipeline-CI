const GEO_URL = 'https://geo.api.gouv.fr';
export const DEPARTMENTS_URL = `${GEO_URL}/departements`;
export const CITIES_URL = `${GEO_URL}/communes`;

const MOCK_URL = 'https://private-cbe05-concerto1.apiary-mock.com/api/v1';
export const REQUEST_DETAIL_URL = `${MOCK_URL}/request`;
// export const FAVOR_URL = `${MOCK_URL}/favor`;

export const BASE_URL = 'http://localhost';
// const BASE_URL = 'http://127.0.0.1:8000';
export const API_URL = `${BASE_URL}/api`;
export const CHECK_USER_URL = `${API_URL}/user`;

export const FAVOR_URL = `${BASE_URL}/favor`;
export const FAVOR_DETAIL_URL = `${BASE_URL}/favor`;
export const POST_FAVOR_URL = `${API_URL}/favor`;
export const POST_FAVOR_COMMENT_URL = `${API_URL}/favor/:favorId/comment`;

export const REQUEST_URL = `${BASE_URL}/request`;
export const POST_REQUEST_URL = `${API_URL}/request`;

export const AUTH_URL = `${BASE_URL}/auth`;
export const LOGIN_URL = `${AUTH_URL}/login`;
export const REGISTER_URL = `${AUTH_URL}/register`;

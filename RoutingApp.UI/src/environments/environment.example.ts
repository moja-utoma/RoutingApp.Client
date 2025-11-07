export const environment = {
  production: false,
  msal: {
    auth: {
      clientId: '__CLIENT_ID__',
      authority: '__AUTHORITY__',
      redirectUri: '__REDIRECT_URI__',
    },
    cache: {
      cacheLocation: '__CACHE_LOCATION__',
      storeAuthStateInCookie: false,
    },
  },
  api: {
    baseUrl: '__API_BASE_URL__',
    scope: '__API_SCOPE__',
  },
};

export const envAuth0 = {
  domain: '__AUTH0_DOMAIN__',
  clientId: '__AUTH0_CLIENT_ID__',
  audience: '__AUTH0_AUDIENCE__',
  redirectUri: '__AUTH0_REDIRECT_URI__',
};

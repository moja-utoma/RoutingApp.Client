export const environment = {
  production: false,
  msal: {
    auth: {
      clientId: '',
      authority: 'https://login.microsoftonline.com/ ',
      redirectUri: 'h',
    },
    cache: {
      cacheLocation: '',
      storeAuthStateInCookie: false,
    },
  },
  api: {
    baseUrl: '',
    scope: '',
  },
};

export const envAuth0 = {
  domain: '__AUTH0_DOMAIN__',
  clientId: '__AUTH0_CLIENT_ID__',
  audience: '__AUTH0_AUDIENCE__',
  redirectUri: '__AUTH0_REDIRECT_URI__',
};

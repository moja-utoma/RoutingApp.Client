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
  domain: '',
  clientId: '',
  audience: 'api link',
  redirectUri: '',
};

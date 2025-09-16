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

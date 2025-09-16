export const environment = {
  production: false,
  backend: 'https://ahcwatch.awjholding.com/backend',
  proxy: 'http://localhost:3000',
  hik: 'http://localhost:3000',
  // Microsoft Azure AD Configuration
  msalConfig: {
    auth: {
      clientId: '888591c1-5f18-4343-bf7c-cd02b2154bac', // Your Azure AD app client ID
      authority: 'https://login.microsoftonline.com/9c8d0d3e-b6ba-4ef3-b023-37952c89fc65', // Your tenant ID
      redirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false
    }
  },
  // API endpoints that require authentication
  protectedResourceMap: new Map([
    ['http://localhost:3000/api', ['api://888591c1-5f18-4343-bf7c-cd02b2154bac/access_as_user']]
  ])
};

export const environment = {
  production: false,
  backend: 'https://ahcwatch.awjholding.com/backend',
  proxy: 'http://localhost:3000',
  hik: 'http://localhost:3000',
  // Microsoft Azure AD Configuration
  msalConfig: {
    auth: {
      clientId: 'YOUR_AZURE_AD_CLIENT_ID', // Replace with your Azure AD app client ID
      authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with your tenant ID
      redirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false
    }
  },
  // API endpoints that require authentication
  protectedResourceMap: new Map([
    ['http://localhost:3000/api', ['api://YOUR_API_CLIENT_ID/access_as_user']]
  ])
};

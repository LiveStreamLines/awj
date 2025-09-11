export const environment = {
  production: true,
  backend: 'https://ahcwatch.awjholding.com/backend',
  proxy: 'https://ahcwatch.awjholding.com/backend',
  hik: 'https://ahcwatch.awjholding.com/backend',
  // Microsoft Azure AD Configuration
  msalConfig: {
    auth: {
      clientId: 'YOUR_AZURE_AD_CLIENT_ID', // Replace with your Azure AD app client ID
      authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with your tenant ID
      redirectUri: 'https://ahcwatch.awjholding.com'
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false
    }
  },
  // API endpoints that require authentication
  protectedResourceMap: new Map([
    ['https://ahcwatch.awjholding.com/backend/api', ['api://YOUR_API_CLIENT_ID/access_as_user']]
  ])
};

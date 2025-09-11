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
      redirectUri: 'https://ahcwatch.awjholding.com',
      postLogoutRedirectUri: 'https://ahcwatch.awjholding.com'
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false
    },
    system: {
      loggerOptions: {
        loggerCallback: (level: any, message: string, containsPii: boolean) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case 0: // LogLevel.Error
              console.error(message);
              return;
            case 1: // LogLevel.Warning
              console.warn(message);
              return;
            case 2: // LogLevel.Info
              console.info(message);
              return;
            case 3: // LogLevel.Verbose
              console.debug(message);
              return;
          }
        }
      }
    }
  },
  // API endpoints that require authentication
  protectedResourceMap: new Map([
    ['https://ahcwatch.awjholding.com/backend/api', ['api://YOUR_API_CLIENT_ID/access_as_user']]
  ])
};

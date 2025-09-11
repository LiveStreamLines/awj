# Microsoft Login Setup Guide

## Azure AD App Registration Setup

To complete the Microsoft login integration, you need to set up an Azure AD app registration:

### 1. Create Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: `AHC Watch Platform`
   - **Supported account types**: Choose based on your organization needs
   - **Redirect URI**: 
     - Type: `Single-page application (SPA)`
     - URI: `https://ahcwatch.awjholding.com`

### 2. Configure Authentication

1. In your app registration, go to **Authentication**
2. Under **Single-page application**, add:
   - `https://ahcwatch.awjholding.com`
3. Under **Implicit grant and hybrid flows**, check:
   - ✅ Access tokens
   - ✅ ID tokens

### 3. Configure API Permissions

1. Go to **API permissions**
2. Add permissions:
   - **Microsoft Graph** > **User.Read** (Delegated)
3. Click **Grant admin consent** if required

### 4. Update Environment Configuration

Update the `src/environment/environments.ts` file with your Azure AD details:

```typescript
export const environment = {
  production: true,
  backend: 'https://ahcwatch.awjholding.com/backend',
  msalConfig: {
    auth: {
      clientId: 'YOUR_AZURE_AD_CLIENT_ID', // Replace with your Client ID
      authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with your Tenant ID
      redirectUri: 'https://ahcwatch.awjholding.com'
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false
    }
  },
  protectedResourceMap: new Map([
    ['https://ahcwatch.awjholding.com/backend/api', ['api://YOUR_API_CLIENT_ID/access_as_user']]
  ])
};
```

### 5. Get Required Information

From your Azure AD app registration:

1. **Client ID**: Found in **Overview** tab
2. **Tenant ID**: Found in **Overview** tab
3. **API Client ID**: Same as Client ID for this setup

### 6. Test the Integration

1. Build and deploy your application
2. Navigate to `https://ahcwatch.awjholding.com`
3. Click on the **Microsoft Login** tab
4. Click **Sign in with Microsoft**
5. Complete the Microsoft authentication flow
6. You should be redirected to the developers page

## Features Implemented

✅ **Microsoft Authentication**: Users can sign in with their Microsoft accounts
✅ **Automatic Redirect**: After successful login, users are redirected to the developers page
✅ **Role-based Access**: Microsoft users get Super Admin role with full access
✅ **Legacy Support**: Original email/password login is still available
✅ **Responsive Design**: Microsoft login works on all devices

## User Experience

- **Primary Login**: Microsoft login is now the first tab
- **Seamless Flow**: After Microsoft authentication, users go directly to developers page
- **Full Access**: Microsoft users have access to all developers, projects, and cameras
- **Fallback Option**: Legacy email/password login remains available

## Security Notes

- Microsoft authentication uses OAuth 2.0 with PKCE
- Tokens are stored securely in session storage
- All API calls are authenticated with Microsoft tokens
- Users are automatically logged out when Microsoft session expires

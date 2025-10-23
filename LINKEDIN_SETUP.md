# LinkedIn OAuth Integration Setup Guide

This guide will help you set up LinkedIn OAuth integration for the Resume Builder application, enabling users to import their LinkedIn profile data directly into their resume.

## Prerequisites

- A LinkedIn account
- Access to [LinkedIn Developer Portal](https://developer.linkedin.com)

## Step 1: Create a LinkedIn Application

1. Go to https://developer.linkedin.com and sign in with your LinkedIn account
2. Navigate to **My Apps** section
3. Click **Create app** button
4. Fill in the required information:
   - **App name**: Resume Builder (or your preferred name)
   - **LinkedIn Page**: Select or create a LinkedIn page for your company
   - **App logo**: Upload a logo (optional but recommended)
   - **Legal agreement**: Check the box to agree to the terms

## Step 2: Get Your API Credentials

1. After creating the app, go to the **Auth** tab
2. You'll find two important credentials:
   - **Client ID**: A unique identifier for your application
   - **Client Secret**: A secret key used for authentication (keep this secure!)
3. **IMPORTANT**: Copy both values - you'll need them in the next step

## Step 3: Configure Redirect URLs

1. Still in the **Auth** tab, find the **Authorized redirect URLs** section
2. Add your callback URLs:
   - For **local development**: `http://localhost:8001/api/auth/linkedin/callback`
   - For **production**: `https://yourdomain.com/api/auth/linkedin/callback`
3. Click **Update** to save the changes

## Step 4: Request Access to Products

1. Go to the **Products** tab in your LinkedIn app dashboard
2. Find **Sign In with LinkedIn using OpenID Connect**
3. Click **Request access** (this is usually auto-approved)
4. This will give you access to:
   - `openid` scope
   - `profile` scope
   - `email` scope

These scopes allow you to retrieve basic profile information (name, email, headline, profile picture).

## Step 5: Add Credentials to Your Application

### For Backend (.env file)

Add the following to your `/app/backend/.env` file:

```ini
# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_REDIRECT_URI=http://localhost:8001/api/auth/linkedin/callback
```

**Important Notes:**
- Replace `your_client_id_here` with your actual Client ID
- Replace `your_client_secret_here` with your actual Client Secret
- For production, update `LINKEDIN_REDIRECT_URI` to your production URL
- NEVER commit the `.env` file to version control (it's already in `.gitignore`)

### Restart the Backend Server

After adding the credentials, restart the backend server:

```bash
sudo supervisorctl restart backend
```

## Step 6: Test the Integration

1. Open your Resume Builder application
2. Click the **Import Resume** button
3. You should now see a **Import from LinkedIn** option
4. Click the **Import from LinkedIn** button
5. You'll be redirected to LinkedIn to authorize the application
6. After authorization, you'll be redirected back with your profile data

## Troubleshooting

### Error: "LinkedIn OAuth is not configured"

This means the environment variables are not set correctly. Double-check:
1. The `.env` file contains the correct keys
2. The backend server was restarted after adding the keys
3. There are no typos in the variable names

### Error: "Invalid redirect_uri"

This means the redirect URI in your code doesn't match what's registered in LinkedIn:
1. Check that the URI in `.env` exactly matches the one in LinkedIn Developer Portal
2. Make sure there are no trailing slashes or extra characters
3. For local development, use `http://localhost:8001/api/auth/linkedin/callback`

### Error: "Invalid client credentials"

This means your Client ID or Client Secret is incorrect:
1. Double-check the values in your `.env` file
2. Make sure there are no extra spaces before or after the values
3. Try regenerating the Client Secret in the LinkedIn Developer Portal

### No Data Imported

If the LinkedIn login works but no data is imported:
1. Check browser console for errors
2. Ensure your LinkedIn profile has public information
3. Try logging out and logging back in to LinkedIn

## Data Privacy and Compliance

### What Data is Collected

The integration collects only:
- Full name (first and last name)
- Email address
- Profile headline
- Profile picture URL
- Locale/language preference

### Advanced Data (Requires Additional Permissions)

For work experience, education, and skills, you'll need to:
1. Apply for LinkedIn Partner Program
2. Request additional API permissions
3. Implement additional API endpoints for profile data retrieval

The current implementation uses **Sign In with LinkedIn using OpenID Connect**, which provides basic profile information without requiring partner program approval.

## Production Deployment

When deploying to production:

1. **Update Redirect URIs**:
   - Add your production domain to Authorized redirect URLs in LinkedIn app settings
   - Update `LINKEDIN_REDIRECT_URI` in production environment variables

2. **Secure Credentials**:
   - Use environment variable injection (not `.env` files) in production
   - Never expose Client Secret in frontend code or public repositories
   - Consider using secrets management services (AWS Secrets Manager, etc.)

3. **HTTPS Requirement**:
   - LinkedIn OAuth requires HTTPS in production
   - Ensure your domain has a valid SSL certificate

4. **Rate Limits**:
   - LinkedIn enforces API rate limits
   - Implement caching to minimize redundant API calls
   - Monitor usage through LinkedIn Developer Portal analytics

## Need Help?

If you encounter issues:
1. Check the [LinkedIn API Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access)
2. Review the [OAuth 2.0 Guide](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)
3. Contact LinkedIn Developer Support

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use HTTPS** for all OAuth flows in production
3. **Validate state parameter** to prevent CSRF attacks (already implemented)
4. **Store access tokens securely** (not in localStorage)
5. **Implement token expiration** and refresh logic
6. **Monitor for suspicious activity** in LinkedIn Developer Portal

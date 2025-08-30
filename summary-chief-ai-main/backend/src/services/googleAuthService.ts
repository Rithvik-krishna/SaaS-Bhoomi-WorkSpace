import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Google OAuth2 configuration
console.log('🔍 Environment Variables:');
console.log('🔍 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'NOT SET');
console.log('🔍 GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'NOT SET');
console.log('🔍 GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI || 'Using default');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/api/google/auth/callback'
);

// Scopes for Google Workspace integration
const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send'
];

export interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export class GoogleAuthService {
  /**
   * Generate the OAuth2 authorization URL
   */
  static generateAuthUrl(forceReauth: boolean = false): string {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent', // Always force consent to get refresh token
      include_granted_scopes: true,
      approval_prompt: 'force' // Always force approval to ensure refresh token
    });
    
    console.log('🔍 Generated Auth URL:', authUrl);
    console.log('🔍 Redirect URI being used:', process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/api/google/auth/callback');
    console.log('🔍 Force re-auth:', forceReauth);
    console.log('🔍 OAuth Parameters: access_type=offline, prompt=consent, approval_prompt=force');
    
    return authUrl;
  }

  /**
   * Exchange authorization code for tokens
   */
    static async exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      
      console.log('🔍 Received tokens:', {
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        scope: tokens.scope,
        tokenType: tokens.token_type,
        expiryDate: tokens.expiry_date
      });
      
      console.log('🔍 Full tokens object:', tokens);
      
      if (!tokens.refresh_token) {
        console.error('❌ NO REFRESH TOKEN RECEIVED!');
        console.error('This means the user will need to re-authenticate when the access token expires.');
        console.error('');
        console.error('🔧 SOLUTION:');
        console.error('1. Ask the user to revoke app access from: https://myaccount.google.com/permissions');
        console.error('2. Then try connecting again with the "Re-authenticate" button');
        console.error('3. This will force Google to show the consent screen and provide a refresh token');
        console.error('');
        console.error('⚠️ Current flow will continue with access token only (will expire in ~1 hour)');
        
        if (!tokens.access_token) {
          throw new Error('No access token received');
        }
        
        return {
          access_token: tokens.access_token,
          refresh_token: '', // Empty string if no refresh token
          scope: tokens.scope || '',
          token_type: tokens.token_type || 'Bearer',
          expiry_date: tokens.expiry_date || 0
        };
      }
      
      console.log('✅ Refresh token received successfully!');
      console.log('✅ User will have persistent access until they revoke permissions');
      
      return {
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope!,
        token_type: tokens.token_type!,
        expiry_date: tokens.expiry_date!
      };
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      const { credentials } = await oauth2Client.refreshAccessToken();
      return credentials.access_token!;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Get user profile information
   */
  static async getUserProfile(accessToken: string) {
    try {
      oauth2Client.setCredentials({
        access_token: accessToken
      });

      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data } = await oauth2.userinfo.get();
      
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  }

  /**
   * Validate if tokens are still valid
   */
  static async validateTokens(accessToken: string, refreshToken: string): Promise<boolean> {
    try {
      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      // Try to get user info to validate tokens
      await this.getUserProfile(accessToken);
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
}

export default GoogleAuthService;

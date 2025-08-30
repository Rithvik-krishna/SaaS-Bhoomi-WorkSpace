import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  iconLink: string;
  webViewLink?: string;
  size?: string;
  modifiedTime?: string;
  createdTime?: string;
  parents?: string[];
  thumbnailLink?: string;
}

export class GoogleDriveService {
  private oauth2Client: OAuth2Client;

  constructor(accessToken: string, refreshToken?: string) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }

  /**
   * Get user's Drive files
   */
  async getFiles(maxResults: number = 20): Promise<DriveFile[]> {
    try {
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      
      const response = await drive.files.list({
        pageSize: maxResults,
        fields: 'files(id,name,mimeType,iconLink,webViewLink,size,modifiedTime,createdTime,parents,thumbnailLink)',
        orderBy: 'modifiedTime desc',
        // Exclude trashed files
        q: 'trashed=false'
      });

      if (!response.data.files) {
        return [];
      }

      return response.data.files.map(file => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        iconLink: file.iconLink!,
        webViewLink: file.webViewLink,
        size: file.size,
        modifiedTime: file.modifiedTime,
        createdTime: file.createdTime,
        parents: file.parents,
        thumbnailLink: file.thumbnailLink
      }));
    } catch (error) {
      console.error('Error fetching Drive files:', error);
      throw new Error('Failed to fetch Drive files');
    }
  }

  /**
   * Get file content (for text files)
   */
  async getFileContent(fileId: string): Promise<string> {
    try {
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      
      const response = await drive.files.get({
        fileId: fileId,
        alt: 'media'
      });

      return response.data as string;
    } catch (error) {
      console.error('Error fetching file content:', error);
      throw new Error('Failed to fetch file content');
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(fileId: string): Promise<DriveFile> {
    try {
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      
      const response = await drive.files.get({
        fileId: fileId,
        fields: 'id,name,mimeType,iconLink,webViewLink,size,modifiedTime,createdTime,parents,thumbnailLink'
      });

      const file = response.data;
      return {
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        iconLink: file.iconLink!,
        webViewLink: file.webViewLink,
        size: file.size,
        modifiedTime: file.modifiedTime,
        createdTime: file.createdTime,
        parents: file.parents,
        thumbnailLink: file.thumbnailLink
      };
    } catch (error) {
      console.error('Error fetching file metadata:', error);
      throw new Error('Failed to fetch file metadata');
    }
  }

  /**
   * Search files by query
   */
  async searchFiles(query: string, maxResults: number = 20): Promise<DriveFile[]> {
    try {
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      
      const response = await drive.files.list({
        pageSize: maxResults,
        fields: 'files(id,name,mimeType,iconLink,webViewLink,size,modifiedTime,createdTime,parents,thumbnailLink)',
        orderBy: 'modifiedTime desc',
        q: `trashed=false and (name contains '${query}' or fullText contains '${query}')`
      });

      if (!response.data.files) {
        return [];
      }

      return response.data.files.map(file => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        iconLink: file.iconLink!,
        webViewLink: file.webViewLink,
        size: file.size,
        modifiedTime: file.modifiedTime,
        createdTime: file.createdTime,
        parents: file.parents,
        thumbnailLink: file.thumbnailLink
      }));
    } catch (error) {
      console.error('Error searching Drive files:', error);
      throw new Error('Failed to search Drive files');
    }
  }

  /**
   * Get files by MIME type
   */
  async getFilesByType(mimeType: string, maxResults: number = 20): Promise<DriveFile[]> {
    try {
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      
      const response = await drive.files.list({
        pageSize: maxResults,
        fields: 'files(id,name,mimeType,iconLink,webViewLink,size,modifiedTime,createdTime,parents,thumbnailLink)',
        orderBy: 'modifiedTime desc',
        q: `trashed=false and mimeType='${mimeType}'`
      });

      if (!response.data.files) {
        return [];
      }

      return response.data.files.map(file => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        iconLink: file.iconLink!,
        webViewLink: file.webViewLink,
        size: file.size,
        modifiedTime: file.modifiedTime,
        createdTime: file.createdTime,
        parents: file.parents,
        thumbnailLink: file.thumbnailLink
      }));
    } catch (error) {
      console.error('Error fetching files by type:', error);
      throw new Error('Failed to fetch files by type');
    }
  }
}

export default GoogleDriveService;

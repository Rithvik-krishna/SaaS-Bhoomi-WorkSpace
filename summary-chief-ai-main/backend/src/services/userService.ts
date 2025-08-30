import User, { IUser } from '../models/User';

export class UserService {
  /**
   * Find or create user by email
   */
  static async findOrCreateUser(email: string, name: string): Promise<IUser> {
    try {
      let user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        user = new User({
          email: email.toLowerCase(),
          name
        });
        await user.save();
        console.log('✅ New user created:', email);
      }
      
      return user;
    } catch (error) {
      console.error('❌ Error in findOrCreateUser:', error);
      throw error;
    }
  }

  /**
   * Update user's Google information
   */
  static async updateGoogleInfo(
    userId: string, 
    googleId: string, 
    googleTokens: any, 
    googleProfile: any
  ): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          googleId,
          googleTokens,
          googleProfile
        },
        { new: true }
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      console.log('✅ Google info updated for user:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Error updating Google info:', error);
      throw error;
    }
  }

  /**
   * Find user by Google ID
   */
  static async findByGoogleId(googleId: string): Promise<IUser | null> {
    try {
      return await User.findOne({ googleId });
    } catch (error) {
      console.error('❌ Error finding user by Google ID:', error);
      throw error;
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      console.error('❌ Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Update Google tokens for user
   */
  static async updateGoogleTokens(userId: string, tokens: any): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { googleTokens: tokens },
        { new: true }
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      console.log('✅ Google tokens updated for user:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Error updating Google tokens:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async findById(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error('❌ Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(userId);
      return !!result;
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    }
  }
}

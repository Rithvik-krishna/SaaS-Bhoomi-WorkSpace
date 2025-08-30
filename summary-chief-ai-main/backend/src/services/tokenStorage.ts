// Shared token storage for demo purposes
// In production, use a database to store tokens securely
class TokenStorage {
  private userTokens = new Map<string, any>();

  setUserTokens(userId: string, tokens: any) {
    this.userTokens.set(userId, {
      ...tokens,
      connectedAt: new Date().toISOString()
    });
  }

  getUserTokens(userId: string) {
    return this.userTokens.get(userId);
  }

  removeUserTokens(userId: string) {
    this.userTokens.delete(userId);
  }

  isUserConnected(userId: string): boolean {
    return this.userTokens.has(userId);
  }
}

// Export singleton instance
export default new TokenStorage();

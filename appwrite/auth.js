import { Client, Account, ID } from 'appwrite';

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return await this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.error('Error while creating account:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  }

  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error('Error while logging in:', error);
      throw new Error(error.message || 'Failed to login');
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      console.error('Error while fetching current user:', error);
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSession('current');
      return { success: true };
    } catch (error) {
      console.error('Error while logging out:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  }

  async logoutFromAllDevices() {
    try {
      await this.account.deleteSessions();
      return { success: true };
    } catch (error) {
      console.error('Error while logging out from all devices:', error);
      throw new Error(error.message || 'Failed to logout from all devices');
    }
  }

  async updatePreferences(prefs) {
    try {
      const user = await this.account.updatePrefs(prefs);
      return user;
    } catch (error) {
      console.error('Error while updating preferences:', error);
      throw new Error(error.message || 'Failed to update preferences');
    }
  }

  async updateName(name) {
    try {
      const user = await this.account.updateName(name);
      return user;
    } catch (error) {
      console.error('Error while updating name:', error);
      throw new Error(error.message || 'Failed to update name');
    }
  }
}

const authService = new AuthService();
export default authService;

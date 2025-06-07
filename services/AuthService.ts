import AsyncStorage from '@react-native-async-storage/async-storage';

// Try multiple possible server URLs for development
const DEV_SERVER_URLS = [
  'http://192.168.68.63:3001/api',  // Original IP
  'http://localhost:3001/api',      // Localhost fallback
  'http://10.0.2.2:3001/api',       // Android emulator host
  'http://10.0.3.2:3001/api',       // iOS simulator host
];


export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  bio?: string;
  location?: string;
  profile_image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  bio?: string;
  location?: string;
  profile_image_url?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  details?: string[];
}

class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static workingApiUrl: string | null = null;

  static async findWorkingApiUrl(): Promise<string> {
    if (this.workingApiUrl) {
      return this.workingApiUrl;
    }

    if (!__DEV__) {
      this.workingApiUrl = 'https://your-production-api.com/api';
      return this.workingApiUrl;
    }    console.log('Testing server URLs...');
    for (const url of DEV_SERVER_URLS) {
      try {
        console.log(`Testing ${url}/health`);
        const response = await fetch(`${url}/health`, { 
          method: 'GET'
        });        if (response.ok) {
          console.log(`[SUCCESS] Found working server at: ${url}`);
          this.workingApiUrl = url;
          return url;
        }
      } catch (error) {
        console.log(`[ERROR] Failed to connect to ${url}:`, error);
      }
    }

    throw new Error('Could not connect to any development server. Please ensure the server is running.');
  }

  static async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(this.TOKEN_KEY, token);
  }

  static async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(this.TOKEN_KEY);
  }

  static async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(this.TOKEN_KEY);
  }  static async makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getToken();
    const apiUrl = await this.findWorkingApiUrl();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers,
    });
  }static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const apiUrl = await this.findWorkingApiUrl();
      console.log('Attempting registration with URL:', `${apiUrl}/auth/register`);
      console.log('Registration data:', { ...data, password: '***' });
      
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Registration response status:', response.status);
      console.log('Registration response headers:', response.headers);

      const result = await response.json();
      console.log('Registration response data:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      await this.setToken(result.token);
      return result;
    } catch (error) {
      console.error('Registration request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed. Please try again.');
    }
  }  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const apiUrl = await this.findWorkingApiUrl();
      console.log('Attempting login with URL:', `${apiUrl}/auth/login`);
      console.log('Login credentials:', { email: credentials.email, password: '***' });
      
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);

      const result = await response.json();
      console.log('Login response data:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      await this.setToken(result.token);
      return result;
    } catch (error) {
      console.error('Login request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const response = await this.makeAuthenticatedRequest('/auth/me');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get user data');
      }

      return result.user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get user data');
    }
  }

  static async updateProfile(data: Partial<RegisterData>): Promise<User> {
    try {
      const response = await this.makeAuthenticatedRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      return result.user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update profile');
    }
  }

  static async logout(): Promise<void> {
    try {
      await this.makeAuthenticatedRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Continue with local logout even if server request fails
      console.log('Server logout failed:', error);
    } finally {
      await this.removeToken();
    }
  }  static async checkHealth(): Promise<boolean> {
    try {
      const apiUrl = await this.findWorkingApiUrl();
      console.log('Checking server health at:', `${apiUrl}/health`);
      const response = await fetch(`${apiUrl}/health`);
      const result = await response.json();
      console.log('Health check response:', result);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  static async testConnection(): Promise<void> {
    console.log('Testing connection to server...');
    console.log('__DEV__:', __DEV__);
    
    const isHealthy = await this.checkHealth();
    console.log('Server health status:', isHealthy);
    
    if (!isHealthy) {
      throw new Error('Cannot connect to server. Please check your network connection and ensure the server is running.');
    }
  }
}

export { AuthService };


import axios from 'axios';
import Cookies from 'js-cookie';

const KEYCLOAK_BASE_URL = 'http://localhost:9090/realms/event-ticket-platform/protocol/openid-connect';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface TokenError {
  error: string;
  error_description: string;
}

class AuthService {
  private readonly clientId = 'event-ticket-platform-app';
  private readonly clientSecret = 'gJCNV7hMkw2ZK9FyARIKTcalWDFacA1g';

  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      formData.append('grant_type', 'password');
      formData.append('client_id', this.clientId);
      formData.append('client_secret', this.clientSecret);

      const response = await axios.post<TokenResponse>(
        `${KEYCLOAK_BASE_URL}/token`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // Save tokens to cookies
      this.saveTokens(response.data);
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.error_description || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  }

  private saveTokens(tokenData: TokenResponse): void {
    // Save access token (expires in 5 minutes)
    Cookies.set('access_token', tokenData.access_token, { 
      expires: tokenData.expires_in / (24 * 60 * 60) // Convert seconds to days
    });
    
    // Save refresh token (expires in 30 minutes)
    Cookies.set('refresh_token', tokenData.refresh_token, { 
      expires: tokenData.refresh_expires_in / (24 * 60 * 60) // Convert seconds to days
    });
    
    // Save token type
    Cookies.set('token_type', tokenData.token_type);
    
    // Save session state
    Cookies.set('session_state', tokenData.session_state);
  }

  getAccessToken(): string | null {
    return Cookies.get('access_token') || null;
  }

  getRefreshToken(): string | null {
    return Cookies.get('refresh_token') || null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    // Clear all auth cookies
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('token_type');
    Cookies.remove('session_state');
  }

  async refreshAccessToken(): Promise<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', refreshToken);
      formData.append('client_id', this.clientId);
      formData.append('client_secret', this.clientSecret);

      const response = await axios.post<TokenResponse>(
        `${KEYCLOAK_BASE_URL}/token`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.saveTokens(response.data);
      return response.data;
    } catch (error: any) {
      this.logout(); // Clear invalid tokens
      throw new Error('Token refresh failed');
    }
  }
}

export const authService = new AuthService();

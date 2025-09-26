import Cookies from 'js-cookie';

export interface DecodedToken {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: {
    roles: string[];
  };
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export const tokenService = {
  getDecodedToken(): DecodedToken | null {
    const token = Cookies.get('access_token');
    if (!token) return null;

    try {
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      // Decode the payload (second part)
      const payload = parts[1];
      // Add padding if needed
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decodedPayload = atob(paddedPayload);
      
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  getUserRoles(): string[] {
    const token = this.getDecodedToken();
    return token?.realm_access?.roles || [];
  },

  isOrganizer(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('ROLE_ORGANIZER');
  },

  isStaff(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('ROLE_STAFF');
  },

  getUserInfo(): { name: string; email: string; username: string } | null {
    const token = this.getDecodedToken();
    if (!token) return null;

    return {
      name: token.name || '',
      email: token.email || '',
      username: token.preferred_username || '',
    };
  },

  isTokenExpired(): boolean {
    const token = this.getDecodedToken();
    if (!token) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return token.exp < currentTime;
  }
};

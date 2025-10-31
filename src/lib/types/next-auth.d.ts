import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id?: string;
  }

  interface Session {
    user: {
      id?: string;
      email?: string | null;
      role?: string | null;
      settings?: {
        units: 'imperial' | 'metric';
        country: string;
        theme: 'light' | 'dark' | 'system';
        profilePicture: string | null;
      } | null;
      randomKey?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
  }
}

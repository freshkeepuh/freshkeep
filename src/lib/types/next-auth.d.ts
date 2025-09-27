import 'next-auth';
import 'next-auth/jwt';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    id?: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: Role | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
  }
}

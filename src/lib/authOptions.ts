/* eslint-disable arrow-body-style */
import { compare } from 'bcryptjs';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';

// Get secret with fallback for development and build time
// During build, Next.js may not have access to env vars, so we provide a fallback
const getSecret = () => {
  const secret =
    process.env.NEXTAUTH_SECRET ??
    process.env.AUTH_SECRET ??
    // Only use fallback in non-production environments
    (process.env.NODE_ENV !== 'production'
      ? 'dev-nextauth-secret-fallback-for-build'
      : undefined);

  // In production, we must have a secret set
  if (!secret && process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line no-console
    console.error(
      'ERROR: NEXTAUTH_SECRET or AUTH_SECRET must be set in production environment variables.',
    );
    throw new Error(
      'NEXTAUTH_SECRET (or AUTH_SECRET) is required in production. Set it in your environment variables.',
    );
  }

  return secret || 'dev-nextauth-secret-fallback-for-build';
};

const secret = getSecret();

const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'john@foo.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            settings: user.settings,
            randomKey: Math.random().toString(36).substring(2, 15),
          };
        } catch (error) {
          // Log error for debugging in production
          // eslint-disable-next-line no-console
          console.error('Authentication error:', error);
          // Return null to indicate authentication failure
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    //   error: '/auth/error',
    //   verifyRequest: '/auth/verify-request',
    newUser: '/auth/signup',
  },
  callbacks: {
    session: ({ session, token }) => {
      // console.log('Session Callback', { session, token })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      // console.log('JWT Callback', { token, user })
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
  secret,
};

export default authOptions;

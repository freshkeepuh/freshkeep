import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { readUser } from './dbUserActions';
import { Session } from 'next-auth';

const getUserFromSession = async (session: Session | null) => {
  if (!session) return null;
  const currentUserId = session?.user.id;
  const currentUser = await readUser(currentUserId);
  return currentUser;
};

/**
 * Redirects to the login page if the user is not logged in.
 */
export const loggedInProtectedPage = async (session: Session | null) => {
  if (!session) {
    redirect('/auth/signin');
  }
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not an admin.
 */
export const adminProtectedPage = async (session: Session | null) => {
  loggedInProtectedPage(session);
  const user = await getUserFromSession(session);
  if (!user) {
    redirect('/auth/signin');
  }
  if (user.role !== Role.ADMIN) {
    redirect('/not-authorized');
  }
};
